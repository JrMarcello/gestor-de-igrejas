'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface DashboardSummary {
  totalMembers: number;
  totalGroups: number;
  totalBiblicalSchoolClasses: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboard/summary`);
        setSummary(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87m-3-12a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalMembers ?? '--'}</div>
            <p className="text-xs text-muted-foreground">Membros cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Grupos</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M15 6v12a3 3 0 1 0 3 3V6a3 3 1 0 0 0-3-3Zm0 0V3" />
              <path d="M18 9h-3" />
              <path d="M18 12h-3" />
              <path d="M18 15h-3" />
              <path d="M6 6v12a3 3 1 0 0 0 3 3v-3.87a4 4 0 0 1-3-3.83V6a3 3 1 0 0 0-3-3Zm0 0V3" />
              <path d="M9 9H6" />
              <path d="M9 12H6" />
              <path d="M9 15H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalGroups ?? '--'}</div>
            <p className="text-xs text-muted-foreground">Grupos e ministérios ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas EBD</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalBiblicalSchoolClasses ?? '--'}</div>
            <p className="text-xs text-muted-foreground">Turmas de Escola Bíblica</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}