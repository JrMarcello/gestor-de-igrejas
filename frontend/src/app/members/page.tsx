'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { MemberForm } from '@/components/members/member-form';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Member {
  id: string;
  name: string;
  birthDate: string;
  phone: string | null;
  address: string | null;
  baptized: boolean;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSave = async (memberData: Omit<Member, 'id'>) => {
    try {
      if (editingMember) {
        await axios.patch(`${API_URL}/members/${editingMember.id}`, memberData);
      } else {
        await axios.post(`${API_URL}/members`, memberData);
      }
      fetchMembers(); // Re-busca os membros para atualizar a lista
      setIsFormOpen(false);
      setEditingMember(undefined);
    } catch (error) {
      console.error('Failed to save member:', error);
    }
  };

  const handleDelete = async (memberId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este membro?')) {
      try {
        await axios.delete(`${API_URL}/members/${memberId}`);
        fetchMembers();
      } catch (error) {
        console.error('Failed to delete member:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Membros</h1>
        <Button onClick={() => {
          setEditingMember(undefined);
          setIsFormOpen(true);
        }}>Adicionar Membro</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Nasc.</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Batizado</TableHead>
              <TableHead><span className="sr-only">Ações</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{new Date(member.birthDate).toLocaleDateString()}</TableCell>
                <TableCell>{member.phone || 'N/A'}</TableCell>
                <TableCell>{member.baptized ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => {
                        setEditingMember(member);
                        setIsFormOpen(true);
                      }}>Editar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(member.id)} className="text-red-600">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <MemberForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSave} 
        memberToEdit={editingMember} 
      />
    </div>
  );
}
