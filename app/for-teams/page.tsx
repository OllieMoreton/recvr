import type { Metadata } from 'next'
import ForTeamsPage from '@/components/ForTeamsPage'

export const metadata: Metadata = {
  title: 'RECVR for Teams — Recovery Intelligence for Clubs & Coaches',
  description:
    'Give every athlete on your team a personalised recovery programme. Built for sports clubs, running clubs, CrossFit boxes, and cycling teams.',
}

export default function ForTeams() {
  return <ForTeamsPage />
}
