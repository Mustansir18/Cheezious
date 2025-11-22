
"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, PlusCircle, User } from 'lucide-react';
import type { User as UserType } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { branches } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

function UserForm({
  onSave,
}: {
  onSave: (user: Omit<UserType, 'id'>) => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'cashier'>('cashier');
  const [branchId, setBranchId] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password && role) {
      onSave({ username, password, role, branchId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
       <div>
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as 'admin' | 'cashier')}>
            <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="admin">Branch Admin</SelectItem>
            </SelectContent>
        </Select>
      </div>
      {(role === 'admin' || role === 'cashier') && (
        <div>
            <Label htmlFor="branch">Branch</Label>
            <Select value={branchId} onValueChange={setBranchId} required>
                <SelectTrigger id="branch">
                    <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                    {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save User</Button>
      </DialogFooter>
    </form>
  );
}


export default function UserManagementPage() {
    const { users, user, addUser, deleteUser } = useAuth();
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleSaveUser = (newUser: Omit<UserType, 'id'>) => {
        addUser(newUser.username, newUser.password, newUser.role, newUser.branchId);
        setDialogOpen(false);
    };
    
    // Filter users: root user sees all, branch admin sees only their branch's users
    const displayableUsers = users.filter(u => {
        if (user?.role === 'root') {
            return u.role !== 'root'; // Don't show root user in the list
        }
        if (user?.role === 'admin') {
            return u.branchId === user.branchId;
        }
        return false;
    });

    return (
        <div className="container mx-auto p-4 lg:p-8 space-y-8">
             <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="font-headline text-4xl font-bold">User Management</CardTitle>
                        <CardDescription>Create and manage cashier and branch admin accounts.</CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add User
                            </Button>
                            </DialogTrigger>
                            <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                            </DialogHeader>
                            <UserForm onSave={handleSaveUser} />
                            </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead className="text-right w-[120px]">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {displayableUsers.map(u => (
                            <TableRow key={u.id}>
                                <TableCell className="font-medium flex items-center">
                                    <User className="mr-2 h-4 w-4 text-muted-foreground"/>
                                    {u.username}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={u.role === 'admin' ? 'secondary' : 'outline'}>
                                        {u.role === 'admin' ? 'Branch Admin' : 'Cashier'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{branches.find(b => b.id === u.branchId)?.name || 'N/A'}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => deleteUser(u.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    {displayableUsers.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No users found for your branch.</p>
                            <p className="text-sm text-muted-foreground">Click "Add User" to create one.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
