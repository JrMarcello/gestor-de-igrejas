'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth/auth-guard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MemberSelect } from '@/components/groups/member-select';
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Member {
  id: string;
  name: string;
}

interface GroupDetail {
  id: string;
  name: string;
  description: string | null;
  members: { member: Member }[];
}

export default function GroupDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<GroupDetail | null>(null);

  const fetchGroup = useCallback(async () => {
    if (!id) return;
    try {
      const response = await axios.get(`${API_URL}/groups/${id}`);
      setGroup(response.data);
    } catch (error) {
      console.error('Failed to fetch group:', error);
      router.push('/groups'); // Redireciona se o grupo não for encontrado
    }
  }, [id, router]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const handleAddMember = async (memberId: string) => {
    try {
      await axios.post(`${API_URL}/groups/${id}/members`, { memberId });
      fetchGroup(); // Atualiza a lista de membros do grupo
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm('Tem certeza que deseja remover este membro do grupo?')) {
      try {
        await axios.delete(`${API_URL}/groups/${id}/members/${memberId}`);
        fetchGroup(); // Atualiza a lista de membros do grupo
      } catch (error) {
        console.error('Failed to remove member:', error);
      }
    }
  };

  if (!group) {
    return <div className="container mx-auto py-10">Carregando...</div>;
  }

  const currentMemberIds = group.members.map(m => m.member.id);

  return (
    <AuthGuard>
      <div className="container mx-auto py-10">
        <Button variant="outline" onClick={() => router.push('/groups')} className="mb-6">
          &larr; Voltar para Grupos
        </Button>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl">{group.name}</CardTitle>
          <CardDescription>{group.description || 'Sem descrição.'}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl">Membros do Grupo</CardTitle>
          <MemberSelect onMemberSelect={handleAddMember} excludeMemberIds={currentMemberIds} />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Membro</TableHead>
                  <TableHead><span className="sr-only">Ações</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">Nenhum membro neste grupo.</TableCell>
                  </TableRow>
                ) : (
                  group.members.map(({ member }) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-red-600">Remover do Grupo</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </AuthGuard>
  );
}
