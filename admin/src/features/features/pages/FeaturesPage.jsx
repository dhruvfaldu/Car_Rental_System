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
        <TableRow key={feat._id} className="border-b border-zinc-800/50 hover:bg-zinc-900/20 transition-colors">
            <TableCell className="py-3">
                <div className="w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-sky-400">
                    <RenderFeatureIcon iconName={feat.icon} className="h-5 w-5 text-sky-400" />
                </div>
            </TableCell>
            <TableCell className="py-3 font-semibold text-zinc-200">
                <div>
                    <p>{feat.name}</p>
                    <p className="text-xs font-normal text-zinc-500 max-w-[240px] truncate mt-0.5" title={feat.description}>
                        {feat.description || "No description provided."}
                    </p>
                </div>
            </TableCell>
            <TableCell className="py-3">
                <StatusBadge status={feat.isActive} type="active" />
            </TableCell>
            <TableCell className="py-3 text-zinc-400 font-medium">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-500" />
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
                        className="h-8 w-8 text-zinc-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-all"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingBrand(feat)}
                        className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
                        Feature Management
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Define specifications and comforts (e.g. WiFi, Airbags, GPS) available for fleet cars.
                    </p>
                </div>
            </div>

            {/* Reusable table component */}
            <MasterTable
                headers={["Icon", "Feature & Description", "Status", "Created At", "Actions"]}
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
                        className="h-10 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-sky-500/10 active:scale-[0.98] transition-all"
                    >
                        <Plus className="h-5 w-5 mr-1" />
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
                <SheetContent className="bg-zinc-950 border-l border-zinc-800 text-zinc-100 max-w-md w-full p-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-zinc-100 font-bold text-xl">
                            {editingFeature ? "Edit Feature" : "Add Feature"}
                        </SheetTitle>
                        <SheetDescription className="text-zinc-400 text-sm">
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
                onClose={() => setDeletingBrand(null)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={`Delete ${deletingFeature?.name}?`}
                description={`Are you sure you want to delete ${deletingFeature?.name}? Deleting it will remove this feature from all cars currently linked to it.`}
            />
        </div>
    );
}
