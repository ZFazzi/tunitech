
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
        proficiencyLevel: 0,
        yearsExperience: 0
      };
      onSkillsChange([...selectedSkills, newSkill]);
    } else {
      onSkillsChange(selectedSkills.filter(s => s.skillCategoryId !== skill.id));
    }
  };

  const updateSkillProficiency = (skillCategoryId: string, proficiencyLevel: number) => {
    onSkillsChange(selectedSkills.map(skill => 
      skill.skillCategoryId === skillCategoryId 
        ? { ...skill, proficiencyLevel }
        : skill
    ));
  };

  const updateSkillExperience = (skillCategoryId: string, yearsExperience: number) => {
    onSkillsChange(selectedSkills.map(skill => 
      skill.skillCategoryId === skillCategoryId 
        ? { ...skill, yearsExperience }
        : skill
    ));
  };

  const isSelected = (skillId: string) => selectedSkills.some(s => s.skillCategoryId === skillId);
  const getSelectedSkill = (skillId: string) => selectedSkills.find(s => s.skillCategoryId === skillId);

  const getProficiencyLabel = (level: number) => {
    const labels = ['Nybörjare', 'Grundläggande', 'Mellanliggande', 'Avancerad', 'Expert'];
    return labels[level] || 'Nybörjare';
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
          <li><strong>Kompetensnivå:</strong> Din kunskap från 0 (Nybörjare) till 4 (Expert)</li>
          <li><strong>År av erfarenhet:</strong> Antal år du har arbetat med denna teknologi</li>
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
                    <div className="ml-6 p-3 bg-gray-50 rounded-lg space-y-3">
                      <div>
                        <Label className="text-sm font-medium">
                          Kompetensnivå: {getProficiencyLabel(selectedSkill.proficiencyLevel)}
                        </Label>
                        <Slider
                          value={[selectedSkill.proficiencyLevel]}
                          onValueChange={(value) => updateSkillProficiency(skill.id, value[0])}
                          max={4}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Nybörjare</span>
                          <span>Expert</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">År av erfarenhet med denna teknologi</Label>
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          value={selectedSkill.yearsExperience}
                          onChange={(e) => updateSkillExperience(skill.id, parseInt(e.target.value) || 0)}
                          className="w-20 mt-1 text-sm"
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
      
      {selectedSkills.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Dina valda färdigheter:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <Badge key={skill.skillCategoryId} variant="secondary">
                {skill.name} ({getProficiencyLabel(skill.proficiencyLevel)}, {skill.yearsExperience} år)
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
