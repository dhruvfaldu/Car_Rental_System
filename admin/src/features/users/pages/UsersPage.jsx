import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import MasterTable from "@/components/master/MasterTable";
import StatusBadge from "@/components/master/StatusBadge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ShieldAlert, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const queryParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
    };

    const {
        users,
        pagination,
        isLoading,
        updateUserRole,
        isUpdatingRole,
        deleteUser,
        isDeleting,
    } = useUsers(queryParams);

    const [editingUser, setEditingUser] = useState(null);
    const [newRole, setNewRole] = useState("");
    const [deletingUser, setDeletingUser] = useState(null);

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleRoleFilterChange = (val) => {
        setRoleFilter(val);
        setCurrentPage(1);
    };

    const handleRoleUpdateSubmit = async () => {
        if (!newRole) return;
        try {
            await updateUserRole({
                userId: editingUser._id,
                role: newRole,
            });
            setEditingUser(null);
            setNewRole("");
        } catch (err) {}
    };

    const handleDeleteSubmit = async () => {
        try {
            await deleteUser(deletingUser._id);
            setDeletingUser(null);
        } catch (err) {}
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "admin":
                return "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400";
            case "staff":
                return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
            case "driver":
                return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
            default:
                return "border-zinc-500/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400";
        }
    };

    const headers = ["User", "Email", "Phone", "Role", "Registered Date", "Actions"];

    const renderRow = (user) => {
        const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        return (
            <TableRow key={user._id} className="border-b border-border hover:bg-muted/30">
                <TableCell className="py-4 font-semibold text-foreground">{user.name}</TableCell>
                <TableCell className="py-4 text-muted-foreground">{user.email}</TableCell>
                <TableCell className="py-4 text-muted-foreground">{user.phone || "—"}</TableCell>
                <TableCell className="py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                        {user.role}
                    </span>
                </TableCell>
                <TableCell className="py-4 text-muted-foreground">{formattedDate}</TableCell>
                <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-border hover:bg-muted"
                            onClick={() => {
                                setEditingUser(user);
                                setNewRole(user.role);
                            }}
                        >
                            Change Role
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletingUser(user)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
                <p className="text-sm text-muted-foreground">
                    Manage system users, assign administrative or staff roles, and delete accounts.
                </p>
            </div>

            <MasterTable
                headers={headers}
                data={users}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search name, email or phone..."
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
                renderRow={renderRow}
                emptyMessage="No users found matching query."
                filterComponent={
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Filter Role:</span>
                        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                            <SelectTrigger className="h-10 w-[150px] border-input bg-background text-foreground">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border text-popover-foreground">
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Administrator</SelectItem>
                                <SelectItem value="staff">Staff Member</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="driver">Driver</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                }
            />

            {/* Change Role Dialog */}
            <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
                <DialogContent className="border-border bg-card text-card-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Change User Role</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Update the system authorization level for <strong className="text-foreground">{editingUser?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger className="w-full border-input bg-background text-foreground">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border text-popover-foreground">
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="staff">Staff Member</SelectItem>
                                <SelectItem value="admin">Administrator</SelectItem>
                                <SelectItem value="driver">Driver</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted"
                            onClick={() => setEditingUser(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={handleRoleUpdateSubmit}
                            disabled={isUpdatingRole}
                        >
                            {isUpdatingRole ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Role"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
                <DialogContent className="border-border bg-card text-card-foreground">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <ShieldAlert className="h-5 w-5" />
                            Delete Account
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Are you absolutely sure you want to delete <strong className="text-foreground">{deletingUser?.name}</strong>'s account?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted"
                            onClick={() => setDeletingUser(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteSubmit}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete User"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
