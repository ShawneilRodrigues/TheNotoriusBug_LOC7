"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Copy,
  Paperclip,
  Mic,
  Image,
  Send,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmployeeChat() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "New Chat",
      messages: [{ role: "ai", content: "Hello! How can I assist you today?" }],
    },
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  // const { theme, setTheme } = useTheme();

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === "") return;

    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, { role: "user", content: chatInput }],
        };
      }
      return chat;
    });
    setChats(updatedChats);

    // Simulate AI response
    setTimeout(() => {
      const updatedChatsWithAI = chats.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              { role: "user", content: chatInput },
              { role: "ai", content: `You said: ${chatInput}` },
            ],
          };
        }
        return chat;
      });
      setChats(updatedChatsWithAI);
    }, 1000);

    setChatInput("");
  };

  const createNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: "New Chat",
      messages: [{ role: "ai", content: "Hello! How can I assist you today?" }],
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
      setChats(
        chats.map((chat) =>
          chat.id === editingChatId
            ? { ...chat, title: editingTitle.trim() }
            : chat
        )
      );
    }
    setEditingChatId(null);
    setEditingTitle("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-50 w-[20vw] bg-card transform transition-transform duration-200 ease-in-out pt-12 bg-blue-950",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
              <div key={chat.id} className="flex items-center mb-2 group">
                {editingChatId === chat.id ? (
                  <div className="flex w-full space-x-2">
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={saveEditingChat}
                      onKeyDown={(e) => e.key === "Enter" && saveEditingChat()}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="flex w-full items-center">
                    <Button
                      variant={chat.id === activeChatId ? "secondary" : "ghost"}
                      className="border py-1 flex-1 justify-between text-left"
                      onClick={() => setActiveChatId(chat.id)}
                    >
                      {chat.title}
                      <Button
                        variant="ghost"
                        size="icon"
                        // className="opacity-0 group-hover:opacity-100"
                        onClick={() => startEditingChat(chat)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {/* <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setTheme(theme === "dark" ? "dark" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button> */}
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
          "flex-1 flex flex-col transition-[margin] duration-200 ease-in-out",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        {/* Toggle Sidebar Button */}
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

        {/* Chat Messages */}
        <main className="flex-1 bg-blue-950/20 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {activeChat?.messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  )}
                >
                  {message.content}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="self-center transition-opacity ml-2"
                  onClick={() => copyToClipboard(message.content)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </main>

        {/* Input Area */}
        <footer className="border-t bg-blue-950/20 p-4">
          <form onSubmit={handleChatSubmit} className="max-w-3xl mx-auto">
            <div className="flex bg-blue-950 items-end space-x-2 bg-card rounded-lg p-2">
              <Button type="button" variant="ghost" size="icon">
                <Paperclip className="h-10 w-10" />
              </Button>
              {/* <Button type="button" variant="ghost" size="icon">
                <Image className="h-5 w-5" />
              </Button> */}
              <Button type="button" variant="ghost" size="icon">
                <Mic className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-2 py-4"
              />
              <Button type="submit" size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}
