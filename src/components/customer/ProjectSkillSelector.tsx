
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface SkillCategory {
  id: string;
  name: string;
  category_type: 'programming_language' | 'framework' | 'database' | 'tool' | 'methodology';
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

  const updateSkillDetail = (skillCategoryId: string, field: 'importanceLevel' | 'minimumYears', value: number) => {
    onSkillsChange(requiredSkills.map(skill => 
      skill.skillCategoryId === skillCategoryId 
        ? { ...skill, [field]: value }
        : skill
    ));
  };

  const isSelected = (skillId: string) => requiredSkills.some(s => s.skillCategoryId === skillId);
  const getSelectedSkill = (skillId: string) => requiredSkills.find(s => s.skillCategoryId === skillId);

  const getCategoryLabel = (type: string) => {
    const labels = {
      'programming_language': 'Programmeringsspråk',
      'framework': 'Ramverk',
      'database': 'Databaser',
      'tool': 'Verktyg',
      'methodology': 'Metoder'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getImportanceLabel = (level: number) => {
    const labels = {
      1: 'Låg',
      2: 'Medel-låg',
      3: 'Medel',
      4: 'Hög',
      5: 'Kritisk'
    };
    return labels[level as keyof typeof labels] || 'Medel';
  };

  if (loading) return <div>Laddar färdigheter...</div>;

  const groupedSkills = skillCategories.reduce((acc, skill) => {
    if (!acc[skill.category_type]) {
      acc[skill.category_type] = [];
    }
    acc[skill.category_type].push(skill);
    return acc;
  }, {} as Record<string, SkillCategory[]>);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Välj tekniska färdigheter som krävs för projektet</h4>
        <p className="text-sm text-gray-600">
          Välj de färdigheter som är viktiga för ditt projekt och ange hur viktig varje färdighet är.
        </p>
      </div>

      {Object.entries(groupedSkills).map(([category, skills]) => (
        <div key={category} className="space-y-3">
          <h4 className="font-semibold text-lg">{getCategoryLabel(category)}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => {
              const selected = isSelected(skill.id);
              const selectedSkill = getSelectedSkill(skill.id);
              
              return (
                <div key={skill.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={skill.id}
                      checked={selected}
                      onCheckedChange={(checked) => handleSkillToggle(skill, !!checked)}
                    />
                    <Label htmlFor={skill.id}>{skill.name}</Label>
                  </div>
                  
                  {selected && selectedSkill && (
                    <div className="ml-6 space-y-3 p-3 bg-gray-50 rounded">
                      <div>
                        <Label className="text-sm">Viktighet</Label>
                        <Select
                          value={selectedSkill.importanceLevel.toString()}
                          onValueChange={(value) => updateSkillDetail(skill.id, 'importanceLevel', parseInt(value))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Låg</SelectItem>
                            <SelectItem value="2">2 - Medel-låg</SelectItem>
                            <SelectItem value="3">3 - Medel</SelectItem>
                            <SelectItem value="4">4 - Hög</SelectItem>
                            <SelectItem value="5">5 - Kritisk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Minst antal års erfarenhet</Label>
                        <Input
                          type="number"
                          min="0"
                          value={selectedSkill.minimumYears}
                          onChange={(e) => updateSkillDetail(skill.id, 'minimumYears', parseInt(e.target.value) || 0)}
                          className="w-24"
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
          <h4 className="font-semibold mb-2">Valda färdighetskrav:</h4>
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
