
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface SkillCategory {
  id: string;
  name: string;
  category_type: string;
}

interface RequiredSkill {
  skillCategoryId: string;
  name: string;
  importanceLevel: number;
  minimumYears: number;
}

interface ProjectSkillSelectorProps {
  requiredSkills: RequiredSkill[];
  onSkillsChange: (skills: RequiredSkill[]) => void;
}

export const ProjectSkillSelector: React.FC<ProjectSkillSelectorProps> = ({
  requiredSkills,
  onSkillsChange
}) => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillCategories();
  }, []);

  const fetchSkillCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('category_type, name');

      if (error) throw error;
      setSkillCategories(data || []);
    } catch (error) {
      console.error('Error fetching skill categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillToggle = (skill: SkillCategory, checked: boolean) => {
    if (checked) {
      const newSkill: RequiredSkill = {
        skillCategoryId: skill.id,
        name: skill.name,
        importanceLevel: 3,
        minimumYears: 1
      };
      onSkillsChange([...requiredSkills, newSkill]);
    } else {
      onSkillsChange(requiredSkills.filter(s => s.skillCategoryId !== skill.id));
    }
  };

  const updateSkillImportance = (skillCategoryId: string, importanceLevel: number) => {
    onSkillsChange(requiredSkills.map(skill => 
      skill.skillCategoryId === skillCategoryId 
        ? { ...skill, importanceLevel }
        : skill
    ));
  };

  const updateSkillMinimumYears = (skillCategoryId: string, minimumYears: number) => {
    onSkillsChange(requiredSkills.map(skill => 
      skill.skillCategoryId === skillCategoryId 
        ? { ...skill, minimumYears }
        : skill
    ));
  };

  const isSelected = (skillId: string) => requiredSkills.some(s => s.skillCategoryId === skillId);
  const getSelectedSkill = (skillId: string) => requiredSkills.find(s => s.skillCategoryId === skillId);

  const getImportanceLabel = (level: number) => {
    const labels = ['', 'Låg', 'Medel-låg', 'Medel', 'Hög', 'Kritisk'];
    return labels[level] || 'Okänd';
  };

  // Group skills by category type
  const groupedSkills = skillCategories.reduce((acc, skill) => {
    if (!acc[skill.category_type]) {
      acc[skill.category_type] = [];
    }
    acc[skill.category_type].push(skill);
    return acc;
  }, {} as Record<string, SkillCategory[]>);

  if (loading) return <div>Laddar färdigheter...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Hur fungerar kompetensbedömningen?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li><strong>Viktighet:</strong> Hur viktigt denna kompetens är för projektet (1-5, där 5=Kritisk)</li>
          <li><strong>Minimum år:</strong> Minsta antal års erfarenhet som krävs inom denna teknologi</li>
        </ul>
      </div>

      {Object.entries(groupedSkills).map(([categoryType, skills]) => (
        <div key={categoryType} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{categoryType}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => {
              const selected = isSelected(skill.id);
              const selectedSkill = getSelectedSkill(skill.id);
              
              return (
                <div key={skill.id} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={skill.id}
                      checked={selected}
                      onCheckedChange={(checked) => handleSkillToggle(skill, !!checked)}
                    />
                    <Label htmlFor={skill.id} className="font-medium">{skill.name}</Label>
                  </div>
                  
                  {selected && selectedSkill && (
                    <div className="ml-6 p-4 bg-gray-50 rounded-lg space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Viktighet för projektet: {getImportanceLabel(selectedSkill.importanceLevel)}
                        </Label>
                        <Slider
                          value={[selectedSkill.importanceLevel]}
                          onValueChange={(value) => updateSkillImportance(skill.id, value[0])}
                          max={5}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Låg</span>
                          <span>Kritisk</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Minimum år av erfarenhet</Label>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          value={selectedSkill.minimumYears}
                          onChange={(e) => updateSkillMinimumYears(skill.id, parseInt(e.target.value) || 0)}
                          className="w-24 mt-1"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {requiredSkills.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Valda kompetensbehov:</h4>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill) => (
              <Badge key={skill.skillCategoryId} variant="secondary">
                {skill.name} ({getImportanceLabel(skill.importanceLevel)}, min {skill.minimumYears} år)
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
