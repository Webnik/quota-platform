import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileCategoriesProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export const FileCategories = ({ selectedCategory, onCategoryChange }: FileCategoriesProps) => {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('file_categories')
      .select('id, name')
      .order('name');

    if (error) {
      toast.error('Failed to load categories');
      return;
    }

    setCategories(data || []);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const { error } = await supabase
      .from('file_categories')
      .insert([{ name: newCategory.trim() }]);

    if (error) {
      toast.error('Failed to add category');
      return;
    }

    toast.success('Category added');
    setNewCategory("");
    setIsAdding(false);
    fetchCategories();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Categories</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isAdding && (
        <div className="flex items-center gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="flex-1"
          />
          <Button onClick={handleAddCategory} size="sm">Add</Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
          >
            <Tag className="h-4 w-4 mr-2" />
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};