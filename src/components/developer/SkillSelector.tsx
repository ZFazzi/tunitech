
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SkillCategory {
  id: string;
  name: string;
  category_type: string;
}

interface SelectedSkill {
  skillCategoryId: string;
  name: string;
  proficiencyLevel: number;
  yearsExperience: number;
}

interface SkillSelectorProps {
  selectedSkills: SelectedSkill[];
  onSkillsChange: (skills: SelectedSkill[]) => void;
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({
  selectedSkills,
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
      const newSkill: SelectedSkill = {
        skillCategoryId: skill.id,
        name: skill.name,
        proficiencyLevel: 3,
        yearsExperience: 1
      };
      onSkillsChange([...selectedSkills, newSkill]);
    } else {
      onSkillsChange(selectedSkills.filter(s => s.skillCategoryId !== skill.id));
    }
  };

  const updateSkillDetail = (skillCategoryId: string, field: 'proficiencyLevel' | 'yearsExperience', value: number) => {
    onSkillsChange(selectedSkills.map(skill => 
      skill.skillCategoryId === skillCategoryId 
        ? { ...skill, [field]: value }
        : skill
    ));
  };

  const isSelected = (skillId: string) => selectedSkills.some(s => s.skillCategoryId === skillId);
  const getSelectedSkill = (skillId: string) => selectedSkills.find(s => s.skillCategoryId === skillId);

  const getCategoryLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'programming_language': 'Programmeringsspråk',
      'framework': 'Ramverk',
      'database': 'Databaser',
      'tool': 'Verktyg',
      'methodology': 'Metoder'
    };
    return labels[type] || type;
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
                    <div className="ml-6 space-y-2 p-3 bg-gray-50 rounded">
                      <div>
                        <Label className="text-sm">Kompetensnivå (1-5)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={selectedSkill.proficiencyLevel}
                          onChange={(e) => updateSkillDetail(skill.id, 'proficiencyLevel', parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">År av erfarenhet</Label>
                        <Input
                          type="number"
                          min="0"
                          value={selectedSkill.yearsExperience}
                          onChange={(e) => updateSkillDetail(skill.id, 'yearsExperience', parseInt(e.target.value) || 0)}
                          className="w-20"
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
      
      {selectedSkills.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Valda färdigheter:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <Badge key={skill.skillCategoryId} variant="secondary">
                {skill.name} (Nivå: {skill.proficiencyLevel}, {skill.yearsExperience} år)
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
