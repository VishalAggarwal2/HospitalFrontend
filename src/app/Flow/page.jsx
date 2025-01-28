"use client";
import React, { useCallback,useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import { Particles } from "../../components/ui/particles";

import '@xyflow/react/dist/style.css';

// Initial nodes representing each step in the user flow
const initialNodes = [
  // First vertical cluster (User Login -> Email Verification)
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'User Login' }, style: { background: '#A5D6A7', color: 'black' } },
  { id: '2', position: { x: 0, y: 150 }, data: { label: 'Email Verification' }, style: { background: '#64B5F6', color: 'black' } },

  // Horizontal cluster (ChatBot -> Session Analysis)
  { id: '3', position: { x: 200, y: 150 }, data: { label: 'ChatBot (Multiple Language)' }, style: { background: '#BA68C8', color: 'black' } },
  { id: '4', position: { x: 400, y: 150 }, data: { label: 'Create Session Analysis' }, style: { background: '#FFB74D', color: 'black' } },

  // Second vertical cluster (Session Analysis -> Analyze Report)
  { id: '5', position: { x: 400, y: 300 }, data: { label: 'Session Analysis' }, style: { background: '#FF7043', color: 'black' } },
  { id: '6', position: { x: 400, y: 450 }, data: { label: 'Analyze Report' }, style: { background: '#FFEB3B', color: 'black' } },

  // Horizontal cluster (Get Report On Mail -> SOS Add Person)
  { id: '7', position: { x: 600, y: 450 }, data: { label: 'Get Report On Mail' }, style: { background: '#81C784', color: 'black' } },
  { id: '8', position: { x: 800, y: 450 }, data: { label: 'Add SOS Person' }, style: { background: '#F44336', color: 'white' } },

  // Vertical cluster (SOS Alert)
  { id: '9', position: { x: 800, y: 600 }, data: { label: 'SOS Alert' }, style: { background: '#D32F2F', color: 'white' } },
];

// Initial edges connecting the nodes
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e8-9', source: '8', target: '9' },
];

export default function App() {
  const [color, setColor] = useState("#ffffff");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }} className='bg-gray-900'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />

<Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
}
