import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function DeleteDialog({
    isOpen = false,
    onClose,
    onConfirm,
    isDeleting = false,
    title = "Are you absolutely sure?",
    description = "This action cannot be undone. This will permanently delete the resource and remove the data from our servers.",
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-zinc-100 max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-zinc-100 font-bold text-lg">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400 text-sm mt-2 leading-relaxed">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 gap-2">
                    <AlertDialogCancel
                        asChild
                        disabled={isDeleting}
                        onClick={onClose}
                    >
                        <Button
                            variant="outline"
                            className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 h-10 font-semibold"
                        >
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction
                        asChild
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                    >
                        <Button
                            disabled={isDeleting}
                            className="bg-rose-600 hover:bg-rose-500 text-white h-10 font-semibold shadow-lg shadow-rose-600/10"
                        >
                            {isDeleting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </span>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
