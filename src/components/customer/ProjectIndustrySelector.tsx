
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface IndustryCategory {
  id: string;
  name: string;
  description: string;
}

interface RequiredIndustry {
  industryCategoryId: string;
  name: string;
  required: boolean;
}

interface ProjectIndustrySelectorProps {
  requiredIndustries: RequiredIndustry[];
  onIndustriesChange: (industries: RequiredIndustry[]) => void;
}

export const ProjectIndustrySelector: React.FC<ProjectIndustrySelectorProps> = ({
  requiredIndustries,
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
      const newIndustry: RequiredIndustry = {
        industryCategoryId: industry.id,
        name: industry.name,
        required: true
      };
      onIndustriesChange([...requiredIndustries, newIndustry]);
    } else {
      onIndustriesChange(requiredIndustries.filter(i => i.industryCategoryId !== industry.id));
    }
  };

  const toggleRequired = (industryCategoryId: string) => {
    onIndustriesChange(requiredIndustries.map(industry => 
      industry.industryCategoryId === industryCategoryId 
        ? { ...industry, required: !industry.required }
        : industry
    ));
  };

  const isSelected = (industryId: string) => requiredIndustries.some(i => i.industryCategoryId === industryId);
  const getSelectedIndustry = (industryId: string) => requiredIndustries.find(i => i.industryCategoryId === industryId);

  if (loading) return <div>Laddar branscher...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Branschexperientet för projektet</h4>
        <p className="text-sm text-gray-600">
          Välj branscher där erfarenhet är önskvärd eller nödvändig för ditt projekt.
        </p>
      </div>

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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`required-${industry.id}`}
                      checked={selectedIndustry.required}
                      onCheckedChange={() => toggleRequired(industry.id)}
                    />
                    <Label htmlFor={`required-${industry.id}`} className="text-sm">
                      Branschexperientet är <strong>nödvändig</strong> (inte bara önskvärd)
                    </Label>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {requiredIndustries.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Valda branschkrav:</h4>
          <div className="flex flex-wrap gap-2">
            {requiredIndustries.map((industry) => (
              <Badge key={industry.industryCategoryId} variant={industry.required ? "default" : "secondary"}>
                {industry.name} {industry.required ? "(Nödvändig)" : "(Önskvärd)"}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
