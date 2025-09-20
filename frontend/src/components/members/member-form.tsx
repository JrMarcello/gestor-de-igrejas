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

// O formulário pode receber um membro para edição
interface MemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: any) => void;
  memberToEdit?: any;
}

export function MemberForm({ isOpen, onClose, onSave, memberToEdit }: MemberFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Se um membro for passado para edição, preenchemos o formulário
  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name || '');
      setBirthDate(memberToEdit.birthDate ? new Date(memberToEdit.birthDate).toISOString().split('T')[0] : '');
      setPhone(memberToEdit.phone || '');
      setAddress(memberToEdit.address || '');
    }
  }, [memberToEdit]);

  const handleSave = () => {
    const memberData = { name, birthDate, phone, address };
    onSave(memberData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{memberToEdit ? 'Editar Membro' : 'Adicionar Membro'}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do membro aqui. Clique em salvar para finalizar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="birthDate" className="text-right">Data de Nasc.</Label>
            <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Telefone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Endereço</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
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
