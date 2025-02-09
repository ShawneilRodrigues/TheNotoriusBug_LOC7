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
import { supabase } from '@/utils/superbaseClient';

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
    const [chats, setChats] = useState<
        Array<{
            id: number;
            title: string;
            messages: Array<{ role: string; content: string }>;
        }>
    >([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [mediaRecorderRef, setMediaRecorderRef] =
        useState<MediaRecorder | null>(null);
    const [streamRef, setStreamRef] = useState<MediaStream | null>(null);

    useEffect(() => {
        setMounted(true);
        fetchChats();
    }, []);

    useEffect(() => {
        if (activeChatId) {
            fetchMessages(activeChatId);
        }
    }, [activeChatId]);

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    useEffect(() => {
        return () => {
            if (streamRef) {
                streamRef.getTracks().forEach((track) => track.stop());
            }
            if (mediaRecorderRef && isRecording) {
                mediaRecorderRef.stop();
            }
        };
    }, [streamRef, mediaRecorderRef, isRecording]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChats = async () => {
        const { data: chatsData, error } = await supabase
            .from('chat')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching chats:', error);
            return;
        }

        if (chatsData && chatsData.length > 0) {
            const formattedChats = chatsData.map((chat) => ({
                id: chat.id,
                title: chat.name || 'New Chat',
                messages: [],
            }));
            setChats(formattedChats);
            setActiveChatId(chatsData[0].id);
        } else {
            createNewChat();
        }
    };

    const fetchMessages = async (chatId: number) => {
        const { data: messagesData, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
            return;
        }

        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === chatId
                    ? {
                          ...chat,
                          messages: messagesData.map((msg) => ({
                              role: msg.is_bot ? 'ai' : 'user',
                              content: msg.content || '',
                          })),
                      }
                    : chat
            )
        );
    };

    const createNewChat = async () => {
        const { data: newChat, error } = await supabase
            .from('chat')
            .insert([
                { name: 'New Chat', created_at: new Date().toISOString() },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating new chat:', error);
            return;
        }

        const welcomeMessage = {
            chat_id: newChat.id,
            content: 'Hello! How can I assist you today?',
            is_bot: true,
            created_at: new Date().toISOString(),
        };

        const { error: messageError } = await supabase
            .from('messages')
            .insert([welcomeMessage]);

        if (messageError) {
            console.error('Error creating welcome message:', messageError);
        }

        setChats((prevChats) => [
            ...prevChats,
            {
                id: newChat.id,
                title: 'New Chat',
                messages: [{ role: 'ai', content: welcomeMessage.content }],
            },
        ]);
        setActiveChatId(newChat.id);
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !activeChatId) return;

        const userMessage = chatInput;
        setChatInput('');

        // Update UI immediately with user message
        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === activeChatId
                    ? {
                          ...chat,
                          messages: [
                              ...chat.messages,
                              { role: 'user', content: userMessage },
                          ],
                      }
                    : chat
            )
        );

        try {
            const formData = new FormData();
            formData.append('text', userMessage);

            const response = await fetch(
                'https://9f3e-103-139-247-63.ngrok-free.app/process-request/',
                {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data); // Debug log

            // Extract the response based on the action type
            let aiResponse;
            if (
                data.action === 'image_description' &&
                data.result?.description
            ) {
                aiResponse = data.result.description;
            } else {
                aiResponse =
                    data.result?.response ||
                    'Sorry, I could not process your request.';
            }

            // Save messages to database and update UI
            const { error: dbError } = await supabase.from('messages').insert([
                {
                    chat_id: activeChatId,
                    content: userMessage,
                    is_bot: false,
                    created_at: new Date().toISOString(),
                },
                {
                    chat_id: activeChatId,
                    content: aiResponse,
                    is_bot: true,
                    created_at: new Date().toISOString(),
                },
            ]);

            if (dbError) {
                console.error('Database error:', dbError);
            }

            // Update UI with AI response
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.id === activeChatId
                        ? {
                              ...chat,
                              messages: [
                                  ...chat.messages,
                                  { role: 'ai', content: aiResponse },
                              ],
                          }
                        : chat
                )
            );
        } catch (error) {
            console.error('Error:', error);
            const errorMessage =
                'Sorry, I encountered an error processing your request.';

            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.id === activeChatId
                        ? {
                              ...chat,
                              messages: [
                                  ...chat.messages,
                                  { role: 'ai', content: errorMessage },
                              ],
                          }
                        : chat
                )
            );
        }
    };

    const deleteChat = async (chatId: number) => {
        // Delete all messages first
        const { error: messagesError } = await supabase
            .from('messages')
            .delete()
            .eq('chat_id', chatId);

        if (messagesError) {
            console.error('Error deleting messages:', messagesError);
            return;
        }

        // Then delete the chat
        const { error: chatError } = await supabase
            .from('chat')
            .delete()
            .eq('id', chatId);

        if (chatError) {
            console.error('Error deleting chat:', chatError);
            return;
        }

        const updatedChats = chats.filter((chat) => chat.id !== chatId);
        setChats(updatedChats);
        if (chatId === activeChatId) {
            setActiveChatId(updatedChats[0]?.id || null);
        }
    };

    const getFileTypeCategory = (file: File): string => {
        const type = file.type.toLowerCase();
        if (type.startsWith('image/')) return 'image';
        if (type.startsWith('audio/')) return 'audio';
        if (type.startsWith('video/')) return 'video';
        if (type.startsWith('application/pdf')) return 'pdf';
        if (
            type.includes('document') ||
            type.includes('sheet') ||
            type.includes('presentation')
        )
            return 'document';
        if (type.startsWith('text/')) return 'text';
        return 'other';
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        for (const file of files) {
            try {
                // Show loading state with file info
                const fileSize = formatFileSize(file.size);
                const fileType = getFileTypeCategory(file);

                setChats((prevChats) =>
                    prevChats.map((chat) =>
                        chat.id === activeChatId
                            ? {
                                  ...chat,
                                  messages: [
                                      ...chat.messages,
                                      {
                                          role: 'user',
                                          content: `Uploading ${fileType} file: ${file.name} (${fileSize})...`,
                                      },
                                  ],
                              }
                            : chat
                    )
                );

                // Create FormData with additional metadata
                const formData = new FormData();
                formData.append('file', file);
                formData.append('file_type', fileType);
                formData.append('file_name', file.name);
                formData.append('file_size', file.size.toString());
                formData.append(
                    'text',
                    chatInput || `Please analyze this ${fileType} file`
                );

                // Log file details for debugging
                console.log('Uploading file:', {
                    name: file.name,
                    type: file.type,
                    category: fileType,
                    size: fileSize,
                });

                const response = await fetch(
                    'https://9f3e-103-139-247-63.ngrok-free.app/process-request/',
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Server response:', data);

                // Extract response based on file type and action
                let aiResponse;
                if (
                    data.action === 'image_description' &&
                    data.result?.description
                ) {
                    aiResponse = data.result.description;
                } else if (
                    data.action === 'document_analysis' &&
                    data.result?.text
                ) {
                    aiResponse = data.result.text;
                } else if (
                    data.action === 'audio_transcription' &&
                    data.result?.transcript
                ) {
                    aiResponse = data.result.transcript;
                } else {
                    aiResponse =
                        data.result?.response ||
                        `Analysis of ${file.name}: ${
                            data.result?.summary || 'No summary available'
                        }`;
                }

                // Save to database using existing columns
                const { error: dbError } = await supabase
                    .from('messages')
                    .insert([
                        {
                            chat_id: activeChatId,
                            content: `File uploaded: ${file.name} (${fileSize}) - Type: ${fileType}`,
                            is_bot: false,
                            created_at: new Date().toISOString(),
                            attachment: true,
                            attachment_type: file.type,
                            attachment_link: file.name,
                        },
                        {
                            chat_id: activeChatId,
                            content: aiResponse,
                            is_bot: true,
                            created_at: new Date().toISOString(),
                        },
                    ]);

                if (dbError) {
                    console.error('Database error:', dbError);
                    throw dbError;
                }

                // Update UI with success message and response
                setChats((prevChats) =>
                    prevChats.map((chat) =>
                        chat.id === activeChatId
                            ? {
                                  ...chat,
                                  messages: [
                                      ...chat.messages.filter(
                                          (m) =>
                                              !m.content.includes('Uploading')
                                      ),
                                      {
                                          role: 'user',
                                          content: `File uploaded: ${file.name} (${fileSize}) - Type: ${fileType}`,
                                          attachment_type: file.type,
                                          attachment_link: file.name,
                                      },
                                      {
                                          role: 'ai',
                                          content: aiResponse,
                                      },
                                  ],
                              }
                            : chat
                    )
                );
            } catch (error) {
                console.error('Error details:', error);
                const errorMessage = `Failed to process file: ${file.name}. Please try again or contact support.`;

                setChats((prevChats) =>
                    prevChats.map((chat) =>
                        chat.id === activeChatId
                            ? {
                                  ...chat,
                                  messages: [
                                      ...chat.messages.filter(
                                          (m) =>
                                              !m.content.includes('Uploading')
                                      ),
                                      { role: 'ai', content: errorMessage },
                                  ],
                              }
                            : chat
                    )
                );
            }
        }

        // Clear the file input and chat input after processing
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setChatInput('');
    };

    const handleVoiceCommand = async () => {
        if (!isRecording && !mediaRecorderRef) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                setStreamRef(stream);

                const mediaRecorder = new MediaRecorder(stream);
                const audioChunks: BlobPart[] = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = async () => {
                    try {
                        const audioBlob = new Blob(audioChunks, {
                            type: 'audio/webm',
                        });
                        const fileName = `voice_${Date.now()}.webm`;

                        // Simpler upload without RLS checks
                        const { data, error: uploadError } =
                            await supabase.storage
                                .from('files')
                                .upload(fileName, audioBlob, {
                                    contentType: 'audio/webm',
                                });

                        if (uploadError) {
                            throw uploadError;
                        }

                        const { data: urlData } = supabase.storage
                            .from('files')
                            .getPublicUrl(fileName);

                        // Save to messages
                        await supabase.from('messages').insert([
                            {
                                chat_id: activeChatId,
                                content: `🎤 Voice Message`,
                                is_bot: false,
                                created_at: new Date().toISOString(),
                                attachment: true,
                                attachment_type: 'audio/webm',
                                attachment_link: urlData.publicUrl,
                            },
                        ]);

                        // Update UI
                        setChats((prevChats) =>
                            prevChats.map((chat) =>
                                chat.id === activeChatId
                                    ? {
                                          ...chat,
                                          messages: [
                                              {
                                                  role: 'user',
                                                  content: `🎤 Voice Message`,
                                                  attachment_type: 'audio/webm',
                                                  attachment_link:
                                                      urlData.publicUrl,
                                              },
                                          ],
                                      }
                                    : chat
                            )
                        );
                    } catch (error) {
                        console.error('Upload error:', error);
                        alert('Failed to upload voice message');
                    } finally {
                        if (streamRef) {
                            streamRef
                                .getTracks()
                                .forEach((track) => track.stop());
                            setStreamRef(null);
                        }
                        setMediaRecorderRef(null);
                        setIsRecording(false);
                    }
                };

                setMediaRecorderRef(mediaRecorder);
                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) {
                console.error('Microphone error:', err);
                alert('Could not access microphone');
            }
        } else if (isRecording && mediaRecorderRef) {
            mediaRecorderRef.stop();
            setIsRecording(false);
        }
    };

    const startEditingChat = (chat: { id: number; title: string }) => {
        setEditingChatId(chat.id);
        setEditingTitle(chat.title);
    };

    const saveEditingChat = async () => {
        if (!editingChatId || !editingTitle.trim()) return;

        const { error } = await supabase
            .from('chat')
            .update({ name: editingTitle.trim() })
            .eq('id', editingChatId);

        if (error) {
            console.error('Error updating chat title:', error);
            return;
        }

        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === editingChatId
                    ? { ...chat, title: editingTitle.trim() }
                    : chat
            )
        );
        setEditingChatId(null);
        setEditingTitle('');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (!mounted) return null;

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside
                className={cn(
                    'absolute inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out pt-12 bg-blue-950',
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
                        {chats
                            .find((chat) => chat.id === activeChatId)
                            ?.messages.map((message, index) => (
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
                                <Paperclip className="h-5 w-5" />
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
