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
            <AlertDialogContent className="max-w-md border border-border bg-card text-card-foreground">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-bold text-foreground">
                        {title}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
                            className="h-10 font-semibold"
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
                            variant="destructive"
                            className="h-10 font-semibold shadow-sm"
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
