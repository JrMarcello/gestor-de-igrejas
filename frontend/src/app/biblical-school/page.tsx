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
import { BiblicalSchoolClassForm } from '@/components/biblical-school/biblical-school-class-form';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface BiblicalSchoolClass {
  id: string;
  name: string;
  description: string | null;
}

export default function BiblicalSchoolPage() {
  const [classes, setClasses] = useState<BiblicalSchoolClass[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<BiblicalSchoolClass | undefined>(undefined);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/biblical-school`);
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch biblical school classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSave = async (classData: Omit<BiblicalSchoolClass, 'id'>) => {
    try {
      if (editingClass) {
        await axios.patch(`${API_URL}/biblical-school/${editingClass.id}`, classData);
      } else {
        await axios.post(`${API_URL}/biblical-school`, classData);
      }
      fetchClasses();
      setIsFormOpen(false);
      setEditingClass(undefined);
    } catch (error) {
      console.error('Failed to save class:', error);
    }
  };

  const handleDelete = async (classId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma? Isso removerá todos os participantes e registros de presença associados.')) {
      try {
        await axios.delete(`${API_URL}/biblical-school/${classId}`);
        fetchClasses();
      } catch (error) {
        console.error('Failed to delete class:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Escola Bíblica Dominical</h1>
        <Button onClick={() => {
          setEditingClass(undefined);
          setIsFormOpen(true);
        }}>Adicionar Turma</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id}>
            <CardHeader>
              <CardTitle>{classItem.name}</CardTitle>
              <CardDescription>{classItem.description || 'Sem descrição.'}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setEditingClass(classItem);
                setIsFormOpen(true);
              }}>Editar</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(classItem.id)}>Excluir</Button>
              <Link href={`/biblical-school/${classItem.id}`} passHref>
                <Button size="sm">Ver Detalhes</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <BiblicalSchoolClassForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSave} 
        classToEdit={editingClass} 
      />
    </div>
  );
}
