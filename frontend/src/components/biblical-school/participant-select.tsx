'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { ClassRole } from '@/types/enums';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Member {
  id: string;
  name: string;
}

interface ParticipantSelectProps {
  onParticipantSelect: (memberId: string, role: ClassRole) => void;
  excludeMemberIds?: string[]; // Membros para excluir da lista de seleção
}

export function ParticipantSelect({ onParticipantSelect, excludeMemberIds = [] }: ParticipantSelectProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(undefined);
  const [selectedRole, setSelectedRole] = useState<ClassRole | undefined>(undefined);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/members`);
        setMembers(response.data.filter((m: Member) => !excludeMemberIds.includes(m.id)));
      } catch (error) {
        console.error('Failed to fetch members for selection:', error);
      }
    };
    fetchMembers();
  }, [excludeMemberIds]);

  const handleAddParticipant = () => {
    if (selectedMemberId && selectedRole) {
      onParticipantSelect(selectedMemberId, selectedRole);
      setSelectedMemberId(undefined);
      setSelectedRole(undefined);
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="grid gap-1">
        <Label htmlFor="select-member">Membro</Label>
        <Select onValueChange={setSelectedMemberId} value={selectedMemberId}>
          <SelectTrigger className="w-[180px]" id="select-member">
            <SelectValue placeholder="Selecionar Membro" />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1">
        <Label htmlFor="select-role">Papel</Label>
        <Select onValueChange={(value: ClassRole) => setSelectedRole(value)} value={selectedRole}>
          <SelectTrigger className="w-[120px]" id="select-role">
            <SelectValue placeholder="Selecionar Papel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ClassRole.TEACHER}>Professor</SelectItem>
            <SelectItem value={ClassRole.STUDENT}>Aluno</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleAddParticipant} disabled={!selectedMemberId || !selectedRole}>Adicionar</Button>
    </div>
  );
}
