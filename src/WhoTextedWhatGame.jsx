import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  useTheme,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  TextField,
  ColorToggle,
  SegmentedControl,
  TextBubble
} from './lib';

export default function WhoTextedWhatGame() {
  const { theme, toggleTheme } = useTheme();
  const [screen, setScreen] = useState('welcome'); // welcome, lobby, game
  const [playerName, setPlayerName] = useState('');
  const [bubbleColor, setBubbleColor] = useState('blue');
  const [matchType, setMatchType] = useState('public');
  const [roomCode, setRoomCode] = useState('');
  const [greeting, setGreeting] = useState('');

  const greetings = [
    "Hello", "Hi", "Yellow", "Blue",
    "I'm in Lake Chargogogogoggman and I got diagnosed with pneumonoultramicroscopicsilicovolcanoconiosis",
    "Alessio!", "Yo", "Sup", "Hey there"
  ];

  useEffect(() => {
    if (screen === 'lobby') {
      setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    }
  }, [screen]);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // ========== WELCOME SCREEN ==========
  if (screen === 'welcome') {
    return (
      <Container className="min-h-screen justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          <Stack gap={6}>
            <Heading level={1} className="text-center">
              📱 WHO TEXTED WHAT? 📱
            </Heading>

            <div>
              <Text className="text-sm opacity-70 mb-2">Your Name</Text>
              <TextField
                value={playerName}
                onChange={setPlayerName}
                placeholder="Enter your name..."
              />
            </div>

            <div>
              <Text className="text-sm opacity-70 mb-2">Bubble Color</Text>
              <ColorToggle value={bubbleColor} onChange={setBubbleColor} />
            </div>

            <div className="flex items-center justify-between">
              <Text className="text-sm opacity-70">Theme</Text>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </Button>
            </div>

            <Stack direction="horizontal" gap={3} className="w-full mt-4">
              <Button 
                onClick={() => playerName.trim() && setScreen('lobby')} 
                className="flex-1" 
                size="lg"
              >
                Create Game
              </Button>
              <Button 
                onClick={() => {
                  if (playerName.trim()) {
                    setMatchType('private');
                    setScreen('lobby');
                  }
                }} 
                variant="outline" 
                className="flex-1" 
                size="lg"
              >
                Join Game
              </Button>
            </Stack>
          </Stack>
        </motion.div>
      </Container>
    );
  }

  // ========== LOBBY SCREEN ==========
  if (screen === 'lobby') {
    return (
      <Container className="min-h-screen justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <Stack gap={6} className="items-center">
            <TextBubble color={bubbleColor} side="left">
              {`${greeting}, ${playerName}!`}
            </TextBubble>

            <SegmentedControl value={matchType} onChange={setMatchType} />

            {matchType === 'public' ? (
              <>
                <Text className="text-sm opacity-60 text-center">
                  Public matchmaking enabled
                </Text>
                <Button onClick={() => setScreen('game')} size="lg">
                  🔍 Find Match
                </Button>
              </>
            ) : (
              <>
                <Text className="text-sm opacity-60 text-center">
                  Share this code with friends:
                </Text>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gray-200 dark:bg-gray-800 px-8 py-4 rounded-2xl"
                >
                  <Text className="text-3xl font-bold tracking-wider">
                    {roomCode || (() => { 
                      const code = generateRoomCode(); 
                      setRoomCode(code); 
                      return code; 
                    })()}
                  </Text>
                </motion.div>
                
                <div className="w-full">
                  <Text className="text-sm opacity-60 mb-2">Or enter a code:</Text>
                  <TextField
                    value={roomCode}
                    onChange={setRoomCode}
                    placeholder="ABCD12"
                    className="text-center uppercase"
                  />
                </div>

                <Stack direction="horizontal" gap={3} className="w-full">
                  <Button onClick={() => setScreen('game')} size="lg" className="flex-1">
                    Start Game
                  </Button>
                  <Button onClick={() => setScreen('welcome')} variant="ghost" size="lg">
                    Back
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </motion.div>
      </Container>
    );
  }

  // ========== GAME SCREEN ==========
  if (screen === 'game') {
    return (
      <Container className="min-h-screen justify-center">
        <Stack gap={6} className="items-center text-center">
          <Heading level={2}>Game Starting Soon! 🎮</Heading>
          <Text className="opacity-70">Waiting for other players...</Text>
          
          <div className="w-full max-w-sm">
            <Stack gap={3}>
              <TextBubble color="blue" side="left">
                Hey what's up?
              </TextBubble>
              <TextBubble color="green" side="right">
                Not much, you?
              </TextBubble>
              <TextBubble color="blue" side="left">
                Just vibing fr fr
              </TextBubble>
            </Stack>
          </div>

          <Button onClick={() => setScreen('welcome')} variant="outline">
            Leave Game
          </Button>
        </Stack>
      </Container>
    );
  }
}