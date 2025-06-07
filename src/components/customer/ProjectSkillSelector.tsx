
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface SkillCategory {
  id: string;
  name: string;
  category_type: string;
}

interface SelectedSkill {
  skillCategoryId: string;
  name: string;
  importanceLevel: number;
  minimumYears: number;
}

interface ProjectSkillSelectorProps {
  selectedSkills: SelectedSkill[];
  onSkillsChange: (skills: SelectedSkill[]) => void;
}

export const ProjectSkillSelector: React.FC<ProjectSkillSelectorProps> = ({
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
        importanceLevel: 3,
        minimumYears: 0
      };
      onSkillsChange([...selectedSkills, newSkill]);
    } else {
      onSkillsChange(selectedSkills.filter(s => s.skillCategoryId !== skill.id));
    }
  };

  const updateSkillImportance = (skillCategoryId: string, importanceLevel: number) => {
    onSkillsChange(selectedSkills.map(skill => 
      skill.skillCategoryId === skillCategoryId 
        ? { ...skill, importanceLevel }
        : skill
    ));
  };

  const updateSkillMinimumYears = (skillCategoryId: string, minimumYears: number) => {
    onSkillsChange(selectedSkills.map(skill => 
      skill.skillCategoryId === skillCategoryId 
        ? { ...skill, minimumYears }
        : skill
    ));
  };

  const isSelected = (skillId: string) => selectedSkills.some(s => s.skillCategoryId === skillId);
  const getSelectedSkill = (skillId: string) => selectedSkills.find(s => s.skillCategoryId === skillId);

  const getImportanceLabel = (level: number) => {
    const labels = ['', 'Låg', 'Måttlig', 'Normal', 'Viktig', 'Kritisk'];
    return labels[level] || 'Normal';
  };

  const getImportanceColor = (level: number) => {
    if (level <= 2) return 'text-tunitech-blue';
    if (level === 3) return 'text-tunitech-mint';
    if (level === 4) return 'text-primary';
    return 'text-destructive';
  };

  const renderImportanceIcons = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <AlertTriangle
        key={i}
        className={`h-4 w-4 ${i < level ? getImportanceColor(level) : 'text-muted-foreground'}`}
        fill={i < level ? 'currentColor' : 'none'}
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
          <h4 className="font-semibold mb-2 text-foreground">Hur fungerar färdighetskraven?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>Viktighet:</strong> Hur kritisk färdigheten är för projektet (1-5)</li>
            <li><strong>Minimum års erfarenhet:</strong> Minsta antal år utvecklaren ska ha arbetat med teknologin</li>
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
                              Viktighet
                            </Label>
                            <div className="flex items-center space-x-2">
                              {renderImportanceIcons(selectedSkill.importanceLevel)}
                              <span className={`text-sm font-medium ${getImportanceColor(selectedSkill.importanceLevel)}`}>
                                {getImportanceLabel(selectedSkill.importanceLevel)}
                              </span>
                            </div>
                          </div>
                          <Slider
                            value={[selectedSkill.importanceLevel]}
                            onValueChange={(value) => updateSkillImportance(skill.id, value[0])}
                            max={5}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Låg</span>
                            <span>Kritisk</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-foreground mb-2 block">
                            Minimum års erfarenhet: {selectedSkill.minimumYears} år
                          </Label>
                          <Slider
                            value={[selectedSkill.minimumYears]}
                            onValueChange={(value) => updateSkillMinimumYears(skill.id, value[0])}
                            max={20}
                            min={0}
                            step={1}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>0 år</span>
                            <span>20+ år</span>
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
            <h4 className="font-semibold mb-3 text-foreground">Valda färdighetskrav ({selectedSkills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge key={skill.skillCategoryId} variant="secondary" className="bg-card text-card-foreground border-border">
                  {skill.name} • {renderImportanceIcons(skill.importanceLevel)} • Min {skill.minimumYears} år
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
