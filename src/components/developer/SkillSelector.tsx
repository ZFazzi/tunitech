
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

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
        proficiencyLevel: 1,
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
    const labels = ['', 'Nybörjare', 'Grundläggande', 'Mellanliggande', 'Avancerad', 'Expert'];
    return labels[level] || 'Nybörjare';
  };

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
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
      <Card className="bg-blue-50/50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-blue-900">Hur fungerar kompetensbedömningen?</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li><strong>Kompetensnivå:</strong> Din kunskap från 1 (Nybörjare) till 5 (Expert)</li>
            <li><strong>År av erfarenhet:</strong> Antal år du har arbetat med denna teknologi</li>
          </ul>
        </CardContent>
      </Card>

      {Object.entries(groupedSkills).map(([categoryType, skills]) => (
        <div key={categoryType} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize text-gray-900">{categoryType}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {skills.map((skill) => {
              const selected = isSelected(skill.id);
              const selectedSkill = getSelectedSkill(skill.id);
              
              return (
                <Card key={skill.id} className={`transition-all ${selected ? 'ring-2 ring-blue-200 bg-blue-50/30' : 'hover:shadow-md'}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={skill.id}
                        checked={selected}
                        onCheckedChange={(checked) => handleSkillToggle(skill, !!checked)}
                      />
                      <Label htmlFor={skill.id} className="font-medium cursor-pointer flex-1">
                        {skill.name}
                      </Label>
                    </div>
                    
                    {selected && selectedSkill && (
                      <div className="space-y-4 pt-2 border-t border-gray-200">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Kompetensnivå
                            </Label>
                            <div className="flex items-center space-x-2">
                              {renderStars(selectedSkill.proficiencyLevel)}
                              <span className="text-sm font-medium text-blue-600">
                                {getProficiencyLabel(selectedSkill.proficiencyLevel)}
                              </span>
                            </div>
                          </div>
                          <Slider
                            value={[selectedSkill.proficiencyLevel]}
                            onValueChange={(value) => updateSkillProficiency(skill.id, value[0])}
                            max={5}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Nybörjare</span>
                            <span>Expert</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            År av erfarenhet
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="50"
                            value={selectedSkill.yearsExperience}
                            onChange={(e) => updateSkillExperience(skill.id, parseInt(e.target.value) || 0)}
                            className="w-24 text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      
      {selectedSkills.length > 0 && (
        <Card className="bg-green-50/50 border-green-200">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-green-900">Dina valda färdigheter ({selectedSkills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge key={skill.skillCategoryId} variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                  {skill.name} • {renderStars(skill.proficiencyLevel)} • {skill.yearsExperience} år
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
