'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';

interface BiblicalSchoolClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: any) => void;
  classToEdit?: any;
}

export function BiblicalSchoolClassForm({ isOpen, onClose, onSave, classToEdit }: BiblicalSchoolClassFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (classToEdit) {
      setName(classToEdit.name || '');
      setDescription(classToEdit.description || '');
    }
  }, [classToEdit]);

  const handleSave = () => {
    const classData = { name, description };
    onSave(classData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{classToEdit ? 'Editar Turma' : 'Adicionar Turma'}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da turma aqui.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Descrição</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
