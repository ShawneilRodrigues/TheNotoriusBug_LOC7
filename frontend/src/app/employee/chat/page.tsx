'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import {
    Menu,
    X,
    LogOut,
    Copy,
    Paperclip,
    Mic,
    Send,
    Pencil,
    Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmployeeChat() {
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [chatInput, setChatInput] = useState('');
    const [editingChatId, setEditingChatId] = useState<number | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [chats, setChats] = useState([
        {
            id: 1,
            title: 'New Chat',
            messages: [
                { role: 'ai', content: 'Hello! How can I assist you today?' },
            ],
        },
    ]);
    const [activeChatId, setActiveChatId] = useState(1);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const activeChat = chats.find((chat) => chat.id === activeChatId);

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (chatInput.trim() === '') return;

        const updatedChats = chats.map((chat) =>
            chat.id === activeChatId
                ? {
                      ...chat,
                      messages: [
                          ...chat.messages,
                          { role: 'user', content: chatInput },
                      ],
                  }
                : chat
        );
        setChats(updatedChats);

        setTimeout(() => {
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.id === activeChatId
                        ? {
                              ...chat,
                              messages: [
                                  ...chat.messages,
                                  { role: 'user', content: chatInput },
                                  {
                                      role: 'ai',
                                      content: `You said: ${chatInput}`,
                                  },
                              ],
                          }
                        : chat
                )
            );
        }, 1000);

        setChatInput('');
    };

    const deleteChat = (chatId: number) => {
        const updatedChats = chats.filter((chat) => chat.id !== chatId);
        setChats(updatedChats);
        if (chatId === activeChatId) {
            setActiveChatId(updatedChats[0]?.id || 0);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUploadedFiles((prev) => [...prev, ...files]);

        // Add file message to chat
        const fileMessages = files.map((file) => ({
            role: 'user' as const,
            content: `Uploaded file: ${file.name}`,
            attachment: file,
        }));

        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === activeChatId
                    ? {
                          ...chat,
                          messages: [...chat.messages, ...fileMessages],
                      }
                    : chat
            )
        );
    };

    const handleVoiceCommand = async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                setIsRecording(true);
                // Here you would typically start recording
                // For demo purposes, we'll just toggle the state
            } catch (err) {
                console.error('Error accessing microphone:', err);
            }
        } else {
            setIsRecording(false);
            // Here you would typically stop recording and process the audio
            // For demo purposes, we'll just add a message
            const updatedChats = chats.map((chat) =>
                chat.id === activeChatId
                    ? {
                          ...chat,
                          messages: [
                              ...chat.messages,
                              {
                                  role: 'user',
                                  content: '🎤 Voice message recorded',
                              },
                          ],
                      }
                    : chat
            );
            setChats(updatedChats);
        }
    };

    const createNewChat = () => {
        const newChat = {
            id: chats.length + 1,
            title: 'New Chat',
            messages: [
                { role: 'ai', content: 'Hello! How can I assist you today?' },
            ],
        };
        setChats([...chats, newChat]);
        setActiveChatId(newChat.id);
    };

    const startEditingChat = (chat: { id: number; title: string }) => {
        setEditingChatId(chat.id);
        setEditingTitle(chat.title);
    };

    const saveEditingChat = () => {
        if (editingTitle.trim()) {
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.id === editingChatId
                        ? { ...chat, title: editingTitle.trim() }
                        : chat
                )
            );
        }
        setEditingChatId(null);
        setEditingTitle('');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside
                className={cn(
                    'absolute inset-y-0 left-0 z-50 w-[20vw] transform transition-transform duration-200 ease-in-out pt-12 bg-blue-950',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full p-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start mb-4"
                        onClick={createNewChat}
                    >
                        + New Chat
                    </Button>

                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                className="flex items-center mb-2 group"
                            >
                                {editingChatId === chat.id ? (
                                    <div className="flex w-full space-x-2">
                                        <Input
                                            value={editingTitle}
                                            onChange={(e) =>
                                                setEditingTitle(e.target.value)
                                            }
                                            onBlur={saveEditingChat}
                                            onKeyDown={(e) =>
                                                e.key === 'Enter' &&
                                                saveEditingChat()
                                            }
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <div className="flex w-full items-center">
                                        <Button
                                            variant={
                                                chat.id === activeChatId
                                                    ? 'secondary'
                                                    : 'ghost'
                                            }
                                            className="border py-1 flex-1 justify-between text-left"
                                            onClick={() =>
                                                setActiveChatId(chat.id)
                                            }
                                        >
                                            {chat.title}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                startEditingChat(chat)
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteChat(chat.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-destructive"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={cn(
                    'flex-1 flex flex-col transition-[margin] duration-200 ease-in-out',
                    isSidebarOpen ? 'ml-64' : 'ml-0'
                )}
            >
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-accent"
                >
                    {isSidebarOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>

                <main className="flex-1 bg-gradient-to-b from-blue-950/20 to-blue-900/20 overflow-y-auto p-4">
                    <div className="max-w-3xl mx-auto space-y-4">
                        {activeChat?.messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'flex items-center',
                                    message.role === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                )}
                            >
                                <div
                                    className={cn(
                                        'max-w-[80%] rounded-lg p-4 shadow-lg border',
                                        message.role === 'user'
                                            ? 'bg-primary text-primary-foreground border-primary/20'
                                            : 'bg-card border-blue-800/30 backdrop-blur-sm'
                                    )}
                                >
                                    {message.content}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="self-center transition-opacity ml-2"
                                    onClick={() =>
                                        copyToClipboard(message.content)
                                    }
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </main>

                <footer className="border-t bg-blue-950/20 p-4">
                    <form
                        onSubmit={handleChatSubmit}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="flex bg-blue-950 items-end space-x-2 bg-card rounded-lg p-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                multiple
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Paperclip className="h-10 w-10" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleVoiceCommand}
                                className={isRecording ? 'text-red-500' : ''}
                            >
                                <Mic className="h-5 w-5" />
                            </Button>
                            <Input
                                placeholder="Type your message..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                className="flex-1 px-2 py-4"
                            />
                            <Button
                                type="submit"
                                size="icon"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                </footer>
            </div>
        </div>
    );
}
