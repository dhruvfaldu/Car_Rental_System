import React, { useState } from "react";
import { useFeatures } from "../hooks/useFeatures";
import MasterTable from "@/components/master/MasterTable";
import StatusBadge from "@/components/master/StatusBadge";
import DeleteDialog from "@/components/master/DeleteDialog";
import FeatureForm from "../components/FeatureForm";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import * as LucideIcons from "lucide-react";

// Dynamic Lucide Icon Renderer
const RenderFeatureIcon = ({ iconName, className = "h-5 w-5" }) => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.Zap;
    return <IconComponent className={className} />;
};

export default function FeaturesPage() {
    const {
        features,
        isLoading,
        createFeature,
        isCreating,
        updateFeature,
        isUpdating,
        deleteFeature,
        isDeleting,
    } = useFeatures();

    // Search and Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // CRUD Modal/Drawer states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [deletingFeature, setDeletingBrand] = useState(null);

    // Filter features by search query
    const filteredFeatures = features.filter((feat) =>
        feat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Frontend pagination logic
    const totalPages = Math.ceil(filteredFeatures.length / itemsPerPage);
    const paginatedFeatures = filteredFeatures.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset page on search
    };

    const handleCreateOrUpdate = async (data) => {
        try {
            if (editingFeature) {
                await updateFeature({ id: editingFeature._id, data });
            } else {
                await createFeature(data);
            }
            setIsFormOpen(false);
            setEditingFeature(null);
        } catch (error) {
            // Toast automatically handled
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingFeature) return;
        try {
            await deleteFeature(deletingFeature._id);
            setDeletingBrand(null);
        } catch (error) {
            // Handled
        }
    };

    const renderFeatureRow = (feat) => (
        <TableRow
            key={feat._id}
            className="border-b border-border transition-colors hover:bg-muted/40"
        >
            <TableCell className="py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-primary">
                    <RenderFeatureIcon
                        iconName={feat.icon}
                        className="h-5 w-5 text-primary"
                    />
                </div>
            </TableCell>

            <TableCell className="py-3">
                <div>
                    <p className="font-semibold text-foreground">
                        {feat.name}
                    </p>

                    <p
                        title={feat.description}
                        className="mt-0.5 max-w-[240px] truncate text-xs font-normal text-muted-foreground"
                    >
                        {feat.description || "No description provided."}
                    </p>
                </div>
            </TableCell>

            <TableCell className="py-3">
                <StatusBadge status={feat.isActive} type="active" />
            </TableCell>

            <TableCell className="py-3 font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />

                    {new Date(feat.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </div>
            </TableCell>

            <TableCell className="py-3">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setEditingFeature(feat);
                            setIsFormOpen(true);
                        }}
                        className="h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingBrand(feat)}
                        className="h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-8">
            {/* Header section */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Feature Management
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Define specifications and comforts (e.g. WiFi, Airbags, GPS) available for fleet cars.
                    </p>
                </div>
            </div>

            {/* Reusable table component */}
            <MasterTable
                headers={[
                    "Icon",
                    "Feature & Description",
                    "Status",
                    "Created At",
                    "Actions",
                ]}
                data={paginatedFeatures}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search features by name..."
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                renderRow={renderFeatureRow}
                emptyMessage="No features found. Add a new feature to get started!"
                addButton={
                    <Button
                        onClick={() => {
                            setEditingFeature(null);
                            setIsFormOpen(true);
                        }}
                        className="h-10 rounded-lg bg-primary text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
                    >
                        <Plus className="mr-1 h-5 w-5" />
                        Add Feature
                    </Button>
                }
            />

            {/* Sheet Form (Drawer) */}
            <Sheet
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingFeature(null);
                }}
            >
                <SheetContent className="w-full max-w-md border-l border-border bg-background p-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl font-semibold text-foreground">
                            {editingFeature ? "Edit Feature" : "Add Feature"}
                        </SheetTitle>

                        <SheetDescription className="text-sm text-muted-foreground">
                            Configure standard vehicle feature name, visual icon, and status constraints.
                        </SheetDescription>
                    </SheetHeader>

                    <FeatureForm
                        initialData={editingFeature}
                        onSubmit={handleCreateOrUpdate}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingFeature(null);
                        }}
                        isLoading={isCreating || isUpdating}
                    />
                </SheetContent>
            </Sheet>

            {/* Deletion confirmation dialog */}
            <DeleteDialog
                isOpen={!!deletingFeature}
                onClose={() => setDeletingFeature(null)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={`Delete ${deletingFeature?.name}?`}
                description={`Are you sure you want to delete ${deletingFeature?.name}? Deleting it will remove this feature from all cars currently linked to it.`}
            />
        </div>
    );
}
