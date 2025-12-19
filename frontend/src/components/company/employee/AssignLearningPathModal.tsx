"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { Loader2, BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";

interface LearningPath {
    _id: string;
    title: string;
    courses: any[];
}

interface AssignLearningPathModalProps {
    isOpen: boolean;
    onClose: () => void;
    employeeId: string;
    assignedPathIds: string[];
    onSuccess: () => void;
}

export default function AssignLearningPathModal({
    isOpen,
    onClose,
    employeeId,
    assignedPathIds,
    onSuccess
}: AssignLearningPathModalProps) {
    const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchLearningPaths();
            setSelectedPaths([]);
        }
    }, [isOpen]);

    const fetchLearningPaths = async () => {
        setLoading(true);
        try {
            const res = await companyApiMethods.getLearningPaths();
            if (res?.data) {
                setLearningPaths(res.data);
            }
        } catch (err) {
            showErrorToast("Failed to fetch learning paths");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (selectedPaths.length === 0) return;

        setSubmitting(true);
        try {
            // The API currently seems to handle one assignment at a time based on companyApiService.ts
            // assignLearningPath: (data: { employeeId: string; learningPathId: string })
            // For multiple, we'd need to loop or update the backend. 
            // I'll stick to the current API and loop for now, or just allow one.
            // Re-reading requirements: "Selecting one or multiple learning paths"

            const promises = selectedPaths.map(pathId =>
                companyApiMethods.assignLearningPath({ employeeId, learningPathId: pathId })
            );

            await Promise.all(promises);
            showSuccessToast("Learning paths assigned successfully");
            onSuccess();
            onClose();
        } catch (err) {
            showErrorToast("Failed to assign learning paths");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredPaths = learningPaths.filter(path =>
        path.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Assign Learning Path</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search learning paths..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : filteredPaths.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No learning paths found.</p>
                        ) : (
                            filteredPaths.map((path) => {
                                const isAssigned = assignedPathIds.includes(path._id);
                                return (
                                    <div
                                        key={path._id}
                                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${isAssigned
                                                ? "bg-white/5 border-white/5 opacity-50 cursor-not-allowed"
                                                : "bg-white/5 border-white/10 hover:border-primary/50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Checkbox
                                                id={path._id}
                                                disabled={isAssigned}
                                                checked={selectedPaths.includes(path._id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedPaths([...selectedPaths, path._id]);
                                                    } else {
                                                        setSelectedPaths(selectedPaths.filter(id => id !== path._id));
                                                    }
                                                }}
                                                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <label htmlFor={path._id} className="cursor-pointer">
                                                <p className="font-semibold text-white">{path.title}</p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                    <BookOpen className="w-3 h-3" /> {path.courses.length} Courses
                                                </p>
                                            </label>
                                        </div>
                                        {isAssigned && (
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Already Assigned</span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/5">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={selectedPaths.length === 0 || submitting}
                        className="bg-primary hover:bg-primary/80 text-white"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Assign {selectedPaths.length > 0 ? `(${selectedPaths.length})` : ""}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
