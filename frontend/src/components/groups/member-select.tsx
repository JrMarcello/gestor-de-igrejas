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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Member {
  id: string;
  name: string;
}

interface MemberSelectProps {
  onMemberSelect: (memberId: string) => void;
  excludeMemberIds?: string[]; // Membros para excluir da lista de seleção
}

export function MemberSelect({ onMemberSelect, excludeMemberIds = [] }: MemberSelectProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(undefined);

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

  const handleSelect = (value: string) => {
    setSelectedMemberId(value);
    onMemberSelect(value);
    setSelectedMemberId(undefined); // Reseta a seleção após adicionar
  };

  return (
    <Select onValueChange={handleSelect} value={selectedMemberId}>
      <SelectTrigger className="w-[180px]">
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
  );
}
