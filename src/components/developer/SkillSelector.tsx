
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
        proficiencyLevel: 3,
        yearsExperience: 1
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

  const getExperienceLabel = (years: number) => {
    if (years === 0) return 'Mindre än 1 år';
    if (years === 1) return '1 år';
    if (years >= 15) return '15+ år';
    return `${years} år`;
  };

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < level ? 'fill-tunitech-mint text-tunitech-mint' : 'text-muted-foreground'}`}
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

  if (loading) return <div className="text-foreground">Laddar färdigheter...</div>;

  return (
    <div className="space-y-6">
      <Card className="bg-tunitech-mint/10 border-tunitech-mint/20">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-foreground">Hur fungerar kompetensbedömningen?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>Kompetensnivå:</strong> Din kunskap från 1 (Nybörjare) till 5 (Expert)</li>
            <li><strong>År av erfarenhet:</strong> Antal år du har arbetat med denna teknologi</li>
          </ul>
        </CardContent>
      </Card>

      {Object.entries(groupedSkills).map(([categoryType, skills]) => (
        <div key={categoryType} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize text-foreground">{categoryType}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {skills.map((skill) => {
              const selected = isSelected(skill.id);
              const selectedSkill = getSelectedSkill(skill.id);
              
              return (
                <Card key={skill.id} className={`transition-all ${selected ? 'ring-2 ring-tunitech-mint/50 bg-tunitech-mint/5' : 'hover:shadow-md'}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={skill.id}
                        checked={selected}
                        onCheckedChange={(checked) => handleSkillToggle(skill, !!checked)}
                      />
                      <Label htmlFor={skill.id} className="font-medium cursor-pointer flex-1 text-foreground">
                        {skill.name}
                      </Label>
                    </div>
                    
                    {selected && selectedSkill && (
                      <div className="space-y-4 pt-2 border-t border-border">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium text-foreground">
                              Kompetensnivå
                            </Label>
                            <div className="flex items-center space-x-2">
                              {renderStars(selectedSkill.proficiencyLevel)}
                              <span className="text-sm font-medium text-tunitech-mint">
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
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Nybörjare</span>
                            <span>Expert</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium text-foreground">
                              År av erfarenhet
                            </Label>
                            <span className="text-sm font-medium text-tunitech-blue">
                              {getExperienceLabel(selectedSkill.yearsExperience)}
                            </span>
                          </div>
                          <Slider
                            value={[selectedSkill.yearsExperience]}
                            onValueChange={(value) => updateSkillExperience(skill.id, value[0])}
                            max={15}
                            min={0}
                            step={1}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Mindre än 1 år</span>
                            <span>15+ år</span>
                          </div>
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
        <Card className="bg-tunitech-blue/10 border-tunitech-blue/20">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-foreground">Dina valda färdigheter ({selectedSkills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge key={skill.skillCategoryId} variant="secondary" className="bg-card text-card-foreground border-border">
                  {skill.name} • {renderStars(skill.proficiencyLevel)} • {getExperienceLabel(skill.yearsExperience)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
