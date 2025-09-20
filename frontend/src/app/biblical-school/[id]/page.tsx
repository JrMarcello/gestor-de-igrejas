'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
import { ParticipantSelect } from '@/components/biblical-school/participant-select';
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClassRole, AttendanceStatus } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface ClassAssignment {
  member: Member;
  role: ClassRole;
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  student: Member;
}

interface BiblicalSchoolClassDetail {
  id: string;
  name: string;
  description: string | null;
  participants: ClassAssignment[];
  attendees: AttendanceRecord[];
}

export default function BiblicalSchoolClassDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [classItem, setClassItem] = useState<BiblicalSchoolClassDetail | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const fetchClass = useCallback(async () => {
    if (!id) return;
    try {
      const response = await axios.get(`${API_URL}/biblical-school/${id}`);
      setClassItem(response.data);
    } catch (error) {
      console.error('Failed to fetch class:', error);
      router.push('/biblical-school');
    }
  }, [id, router]);

  const fetchAttendance = useCallback(async (date: string) => {
    if (!id || !date) return;
    try {
      const response = await axios.get(`${API_URL}/biblical-school/${id}/attendance?date=${date}`);
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      setAttendanceRecords([]);
    }
  }, [id]);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  useEffect(() => {
    if (attendanceDate) {
      fetchAttendance(attendanceDate);
    }
  }, [attendanceDate, fetchAttendance]);

  const handleAssignParticipant = async (memberId: string, role: ClassRole) => {
    try {
      await axios.post(`${API_URL}/biblical-school/${id}/participants`, { memberId, role });
      fetchClass();
    } catch (error) {
      console.error('Failed to assign participant:', error);
    }
  };

  const handleRemoveParticipant = async (memberId: string) => {
    if (window.confirm('Tem certeza que deseja remover este participante da turma?')) {
      try {
        await axios.delete(`${API_URL}/biblical-school/${id}/participants/${memberId}`);
        fetchClass();
      } catch (error) {
        console.error('Failed to remove participant:', error);
      }
    }
  };

  const handleRecordAttendance = async (studentId: string, status: AttendanceStatus) => {
    try {
      await axios.post(`${API_URL}/biblical-school/${id}/attendance`, {
        memberId: studentId,
        date: attendanceDate,
        status,
      });
      fetchAttendance(attendanceDate);
    } catch (error) {
      console.error('Failed to record attendance:', error);
    }
  };

  const handleUpdateAttendance = async (attendanceId: string, status: AttendanceStatus) => {
    try {
      await axios.patch(`${API_URL}/biblical-school/attendance/${attendanceId}`, { status });
      fetchAttendance(attendanceDate);
    } catch (error) {
      console.error('Failed to update attendance:', error);
    }
  };

  if (!classItem) {
    return <div className="container mx-auto py-10">Carregando...</div>;
  }

  const currentParticipantMemberIds = classItem.participants.map(p => p.member.id);
  const studentsInClass = classItem.participants.filter(p => p.role === ClassRole.STUDENT).map(p => p.member);

  return (
    <div className="container mx-auto py-10">
      <Button variant="outline" onClick={() => router.push('/biblical-school')} className="mb-6">
        &larr; Voltar para Turmas
      </Button>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl">{classItem.name}</CardTitle>
          <CardDescription>{classItem.description || 'Sem descrição.'}</CardDescription>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl">Participantes da Turma</CardTitle>
          <ParticipantSelect onParticipantSelect={handleAssignParticipant} excludeMemberIds={currentParticipantMemberIds} />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead><span className="sr-only">Ações</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classItem.participants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Nenhum participante nesta turma.</TableCell>
                  </TableRow>
                ) : (
                  classItem.participants.map(({ member, role }) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{role === ClassRole.TEACHER ? 'Professor' : 'Aluno'}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleRemoveParticipant(member.id)} className="text-red-600">Remover</DropdownMenuItem>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl">Controle de Presença</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="attendance-date">Data:</Label>
            <Input 
              id="attendance-date"
              type="date" 
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-[180px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Ações</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsInClass.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Nenhum aluno nesta turma para registrar presença.</TableCell>
                  </TableRow>
                ) : (
                  studentsInClass.map((student) => {
                    const record = attendanceRecords.find(ar => ar.student.id === student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>
                          <Select 
                            value={record?.status || ''}
                            onValueChange={(value: AttendanceStatus) => {
                              if (record) {
                                handleUpdateAttendance(record.id, value);
                              } else {
                                handleRecordAttendance(student.id, value);
                              }
                            }}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Selecionar Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={AttendanceStatus.PRESENT}>Presente</SelectItem>
                              <SelectItem value={AttendanceStatus.ABSENT}>Ausente</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          {/* Futuras ações, se necessário */}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
