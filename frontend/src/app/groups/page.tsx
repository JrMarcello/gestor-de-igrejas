'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';
import { GroupForm } from '@/components/groups/group-form';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Group {
  id: string;
  name: string;
  description: string | null;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | undefined>(undefined);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups`);
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSave = async (groupData: Omit<Group, 'id'>) => {
    try {
      if (editingGroup) {
        await axios.patch(`${API_URL}/groups/${editingGroup.id}`, groupData);
      } else {
        await axios.post(`${API_URL}/groups`, groupData);
      }
      fetchGroups();
      setIsFormOpen(false);
      setEditingGroup(undefined);
    } catch (error) {
      console.error('Failed to save group:', error);
    }
  };

  const handleDelete = async (groupId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo? Isso removerá todas as associações de membros.')) {
      try {
        await axios.delete(`${API_URL}/groups/${groupId}`);
        fetchGroups();
      } catch (error) {
        console.error('Failed to delete group:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Grupos e Ministérios</h1>
        <Button onClick={() => {
          setEditingGroup(undefined);
          setIsFormOpen(true);
        }}>Adicionar Grupo</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>{group.description || 'Sem descrição.'}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setEditingGroup(group);
                setIsFormOpen(true);
              }}>Editar</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(group.id)}>Excluir</Button>
              <Link href={`/groups/${group.id}`} passHref>
                <Button size="sm">Ver Detalhes</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <GroupForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSave} 
        groupToEdit={editingGroup} 
      />
    </div>
  );
}
