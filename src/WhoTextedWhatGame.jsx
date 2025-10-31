import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./lib/context/ThemeProvider";
import { Text, TextBubble, Container, Stack, Button, ColorToggle, SegmentedControl, TextField, Heading } from './lib/index'

export default function WhoTextedWhatGame() {
  const { theme, toggleTheme } = useTheme();
  const [screen, setScreen] = useState('welcome');
  const [playerName, setPlayerName] = useState('');
  const [bubbleColor, setBubbleColor] = useState('blue');
  const [secretCode, setSecretCode] = useState('');
  const [matchType, setMatchType] = useState('public'); // public or private
  const [roomCode, setRoomCode] = useState('');
  const [joinedPlayers, setJoinedPlayers] = useState([]);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateMatch = () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }
    if (matchType === 'private') {
      const newRoomCode = generateRoomCode();
      setRoomCode(newRoomCode);
      setScreen('creating-private');
    } else {
      setScreen('creating-public');
    }
  };

  const handleJoinMatch = () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }
    if (matchType === 'private') {
      setScreen('join-private');
    } else {
      setScreen('joining');
    }
  };

  const handleJoinPrivateRoom = () => {
    if (!roomCode.trim()) {
      alert('Please enter a room code!');
      return;
    }
    setScreen('joining');
  };

  // ========== WELCOME SCREEN ==========
  if (screen === 'welcome') {
    return (
      <Container className="min-h-screen justify-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Stack gap={6} className="px-4">
            <Heading level={1} className="text-center mb-2">
              📱 WHO TEXTED WHAT? 📱
            </Heading>
            <Text className="text-center text-sm opacity-70 mb-4">
              Welcome to a cool semi-social interaction game
            </Text>

            <div className="space-y-2">
              <Text className="text-sm opacity-70">Your Name</Text>
              <TextField
                value={playerName}
                onChange={setPlayerName}
                placeholder="Enter your name..."
              />
            </div>

            <div className="space-y-2">
              <Text className="text-sm opacity-70">Bubble Color</Text>
              <ColorToggle value={bubbleColor} onChange={setBubbleColor} />
            </div>

            <div className="space-y-2">
              <Text className="text-sm opacity-70">Match Type</Text>
              <SegmentedControl
                value={matchType}
                onChange={setMatchType}
                options={[
                  { value: 'public', label: '🌍 Public' },
                  { value: 'private', label: '🔒 Private' }
                ]}
              />
              <Text className="text-xs opacity-50 italic">
                {matchType === 'public' 
                  ? 'Join random players from around the world' 
                  : 'Create or join a private room with friends'}
              </Text>
            </div>

            <div className="flex items-center justify-between py-2">
              <Text className="text-sm opacity-70">Theme</Text>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </Button>
            </div>

            <div className="flex gap-4 w-full mt-4">
              <Button 
                onClick={handleCreateMatch} 
                className="flex-1 py-4"
                size="lg"
              >
                Create Match
              </Button>
              <Button 
                onClick={handleJoinMatch}
                variant="outline" 
                className="flex-1 py-4"
                size="lg"
              >
                {matchType === 'public' ? 'Find Match' : 'Join Room'}
              </Button>
            </div>

            <div className="space-y-2 mt-4">
              <Text className="text-sm opacity-70">🔐 Secret Code</Text>
              <TextField
                value={secretCode}
                onChange={setSecretCode}
                placeholder="Enter codes for special bubble variations!"
                className="text-center"
              />
            </div>
          </Stack>
        </motion.div>
      </Container>
    );
  }

  // ========== CREATING GAME - PUBLIC ==========
  if (screen === 'creating-public') {
    return (
      <Container className="min-h-screen justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Stack gap={6} className="px-4">
            <Heading level={2} className="text-center">
              🌍 Public Match
            </Heading>
            <Text className="text-center text-sm opacity-70">
              Your server can be joined by people around the world!
            </Text>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-2">
              <Text className="text-sm font-bold opacity-70">People who joined:</Text>
              <div className="space-y-2">
                <Text className="text-sm">• {playerName} (You)</Text>
                {joinedPlayers.map((player, i) => (
                  <Text key={i} className="text-sm">• {player}</Text>
                ))}
                {joinedPlayers.length === 0 && (
                  <Text className="text-sm opacity-50 italic">Waiting for players...</Text>
                )}
              </div>
            </div>

            <Button 
              onClick={() => setScreen('texting')}
              size="lg"
              className="w-full py-4"
              disabled={joinedPlayers.length === 0}
            >
              🔍 Find Match
            </Button>

            <Button 
              onClick={() => setScreen('welcome')}
              variant="ghost"
              size="md"
            >
              Back
            </Button>
          </Stack>
        </motion.div>
      </Container>
    );
  }

  // ========== CREATING GAME - PRIVATE ==========
  if (screen === 'creating-private') {
    return (
      <Container className="min-h-screen justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Stack gap={6} className="px-4">
            <Heading level={2} className="text-center">
              🔒 Private Match
            </Heading>
            <Text className="text-center text-sm opacity-70">
              Share this code with your friends!
            </Text>

            <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-6 text-center">
              <Text className="text-sm opacity-70 mb-2">Room Code</Text>
              <Heading level={3} className="font-mono tracking-widest">
                {roomCode}
              </Heading>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-2">
              <Text className="text-sm font-bold opacity-70">People who joined:</Text>
              <div className="space-y-2">
                <Text className="text-sm">• {playerName} (You - Host)</Text>
                {joinedPlayers.map((player, i) => (
                  <Text key={i} className="text-sm">• {player}</Text>
                ))}
                {joinedPlayers.length === 0 && (
                  <Text className="text-sm opacity-50 italic">Waiting for friends...</Text>
                )}
              </div>
            </div>

            <Button 
              onClick={() => setScreen('texting')}
              size="lg"
              className="w-full py-4"
              disabled={joinedPlayers.length === 0}
            >
              Start Game
            </Button>

            <Button 
              onClick={() => setScreen('welcome')}
              variant="ghost"
              size="md"
            >
              Back
            </Button>
          </Stack>
        </motion.div>
      </Container>
    );
  }

  // ========== JOIN PRIVATE ROOM ==========
  if (screen === 'join-private') {
    return (
      <Container className="min-h-screen justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Stack gap={6} className="px-4">
            <Heading level={2} className="text-center">
              Join Private Room
            </Heading>
            <Text className="text-center text-sm opacity-70">
              Enter the room code from your friend
            </Text>

            <div className="space-y-2">
              <Text className="text-sm opacity-70">Room Code</Text>
              <TextField
                value={roomCode}
                onChange={setRoomCode}
                placeholder="Enter 6-character code..."
                className="text-center font-mono uppercase tracking-widest"
                maxLength={6}
              />
            </div>

            <Button 
              onClick={handleJoinPrivateRoom}
              size="lg"
              className="w-full py-4"
            >
              Join Room
            </Button>

            <Button 
              onClick={() => setScreen('welcome')}
              variant="ghost"
              size="md"
            >
              Back
            </Button>
          </Stack>
        </motion.div>
      </Container>
    );
  }

  // ========== JOINING GAME ==========
  if (screen === 'joining') {
    return (
      <Container className="min-h-screen justify-center py-8">
        <Stack gap={6} className="items-center text-center px-4 max-w-md">
          <Heading level={2}>
            {matchType === 'private' ? 'Joining Room...' : 'Finding a match...'}
          </Heading>
          <Text className="opacity-70">
            {matchType === 'private' 
              ? `Connecting to room ${roomCode}...` 
              : "You'll be in a match soon."}
          </Text>
          
          <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-4 w-full">
            <Text className="text-sm">💡 <strong>Tip:</strong> The key to winning is paying attention to how people text!</Text>
          </div>

          <div className="w-full space-y-4 my-6">
            <TextBubble color="blue" side="left">
              Yo what's good
            </TextBubble>
            <TextBubble color="green" side="right">
              Not much wby
            </TextBubble>
            <TextBubble color="blue" side="left">
              Just chilling fr
            </TextBubble>
          </div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-4xl"
          >
            ⏳
          </motion.div>
        </Stack>
      </Container>
    );
  }

  // ========== TEXTING TIME (PLACEHOLDER) ==========
  if (screen === 'texting') {
    return (
      <Container className="min-h-screen justify-center py-8">
        <Stack gap={6} className="items-center text-center px-4 max-w-md">
          <Heading level={2}>Texting Phase 💬</Heading>
          <Text className="opacity-70">Coming soon...</Text>
          <Button onClick={() => setScreen('welcome')} variant="outline">
            Back to Start
          </Button>
        </Stack>
      </Container>
    );
  }
}