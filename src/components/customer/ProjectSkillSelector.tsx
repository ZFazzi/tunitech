
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

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
        importanceLevel: 2,
        minimumYears: 0
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
    return labels[level] || 'Låg';
  };

  const getImportanceColor = (level: number) => {
    const colors = ['', 'text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600', 'text-red-800'];
    return colors[level] || 'text-green-600';
  };

  const renderImportanceIcon = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <AlertTriangle
        key={i}
        className={`h-4 w-4 ${i < level ? getImportanceColor(level) + ' fill-current' : 'text-gray-300'}`}
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
            <li><strong>Viktighet:</strong> Hur viktigt från 1 (Låg) till 5 (Kritisk) för projektet</li>
            <li><strong>Minimum år:</strong> Minsta antal års erfarenhet som krävs</li>
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
                              Viktighet för projektet
                            </Label>
                            <div className="flex items-center space-x-2">
                              {renderImportanceIcon(selectedSkill.importanceLevel)}
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
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Låg</span>
                            <span>Kritisk</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Minimum antal års erfarenhet som krävs
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={selectedSkill.minimumYears}
                            onChange={(e) => updateSkillMinimumYears(skill.id, parseInt(e.target.value) || 0)}
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
      
      {requiredSkills.length > 0 && (
        <Card className="bg-green-50/50 border-green-200">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-green-900">Valda kompetensbehov ({requiredSkills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill) => (
                <Badge key={skill.skillCategoryId} variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                  {skill.name} • {getImportanceLabel(skill.importanceLevel)} • min {skill.minimumYears} år
                </Badge>
              ))}
            </div>
          </CardContent>
        </div>
      )}
    </div>
  );
};
