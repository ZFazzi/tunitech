
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface IndustryCategory {
  id: string;
  name: string;
  description: string;
}

interface SelectedIndustry {
  industryCategoryId: string;
  name: string;
  yearsExperience: number;
}

interface IndustrySelectorProps {
  selectedIndustries: SelectedIndustry[];
  onIndustriesChange: (industries: SelectedIndustry[]) => void;
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  selectedIndustries,
  onIndustriesChange
}) => {
  const [industryCategories, setIndustryCategories] = useState<IndustryCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIndustryCategories();
  }, []);

  const fetchIndustryCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('industry_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setIndustryCategories(data || []);
    } catch (error) {
      console.error('Error fetching industry categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryToggle = (industry: IndustryCategory, checked: boolean) => {
    if (checked) {
      const newIndustry: SelectedIndustry = {
        industryCategoryId: industry.id,
        name: industry.name,
        yearsExperience: 1
      };
      onIndustriesChange([...selectedIndustries, newIndustry]);
    } else {
      onIndustriesChange(selectedIndustries.filter(i => i.industryCategoryId !== industry.id));
    }
  };

  const updateIndustryExperience = (industryCategoryId: string, yearsExperience: number) => {
    onIndustriesChange(selectedIndustries.map(industry => 
      industry.industryCategoryId === industryCategoryId 
        ? { ...industry, yearsExperience }
        : industry
    ));
  };

  const isSelected = (industryId: string) => selectedIndustries.some(i => i.industryCategoryId === industryId);
  const getSelectedIndustry = (industryId: string) => selectedIndustries.find(i => i.industryCategoryId === industryId);

  if (loading) return <div>Laddar branscher...</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {industryCategories.map((industry) => {
          const selected = isSelected(industry.id);
          const selectedIndustry = getSelectedIndustry(industry.id);
          
          return (
            <div key={industry.id} className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id={industry.id}
                  checked={selected}
                  onCheckedChange={(checked) => handleIndustryToggle(industry, !!checked)}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor={industry.id} className="font-medium">{industry.name}</Label>
                  <p className="text-sm text-gray-600">{industry.description}</p>
                </div>
              </div>
              
              {selected && selectedIndustry && (
                <div className="ml-6 p-3 bg-gray-50 rounded">
                  <Label className="text-sm">År av branschexperienhet</Label>
                  <Input
                    type="number"
                    min="0"
                    value={selectedIndustry.yearsExperience}
                    onChange={(e) => updateIndustryExperience(industry.id, parseInt(e.target.value) || 0)}
                    className="w-24 mt-1"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedIndustries.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Vald branschexperientet:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedIndustries.map((industry) => (
              <Badge key={industry.industryCategoryId} variant="secondary">
                {industry.name} ({industry.yearsExperience} år)
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
