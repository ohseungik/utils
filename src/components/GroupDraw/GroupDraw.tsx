"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Users, UserCheck, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

type DrawMode = "teams" | "winners";

interface DrawResult {
  id: string;
  mode: DrawMode;
  timestamp: number;
  participants: string[];
  teamCount?: number;
  winnerCount?: number;
  result: string[][] | string[];
}

export default function GroupDraw() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<DrawMode>("teams");
  const [participantsText, setParticipantsText] = useState("");
  const [teamCount, setTeamCount] = useState(2);
  const [winnerCount, setWinnerCount] = useState(1);
  const [currentResult, setCurrentResult] = useState<string[][] | string[] | null>(null);
  const [history, setHistory] = useState<DrawResult[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("groupDrawHistory");
    const savedParticipants = localStorage.getItem("groupDrawParticipants");
    
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        // ignore parse errors
      }
    }
    
    if (savedParticipants) {
      setParticipantsText(savedParticipants);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("groupDrawHistory", JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    localStorage.setItem("groupDrawParticipants", participantsText);
  }, [participantsText]);

  const getParticipants = (): string[] => {
    return participantsText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const validateInput = (): boolean => {
    const participants = getParticipants();
    
    if (participants.length === 0) {
      toast.error(t("tools.groupdraw.noParticipants"));
      return false;
    }

    if (mode === "teams") {
      if (teamCount < 2 || teamCount > participants.length) {
        toast.error(t("tools.groupdraw.invalidTeamCount"));
        return false;
      }
    } else {
      if (winnerCount < 1 || winnerCount > participants.length) {
        toast.error(t("tools.groupdraw.invalidWinnerCount"));
        return false;
      }
    }

    return true;
  };

  const handleDraw = () => {
    if (!validateInput()) return;

    const participants = getParticipants();
    const shuffled = shuffleArray(participants);
    let result: string[][] | string[];

    if (mode === "teams") {
      // Divide into teams
      const teams: string[][] = Array.from({ length: teamCount }, () => []);
      shuffled.forEach((person, index) => {
        teams[index % teamCount].push(person);
      });
      result = teams;
      toast.success(t("tools.groupdraw.teamsCreated"));
    } else {
      // Pick winners
      result = shuffled.slice(0, winnerCount);
      toast.success(t("tools.groupdraw.winnersPicked"));
    }

    setCurrentResult(result);

    // Save to history
    const newResult: DrawResult = {
      id: Date.now().toString(),
      mode,
      timestamp: Date.now(),
      participants,
      teamCount: mode === "teams" ? teamCount : undefined,
      winnerCount: mode === "winners" ? winnerCount : undefined,
      result,
    };

    setHistory(prev => [newResult, ...prev].slice(0, 10)); // Keep only last 10 results
  };

  const handleCopyResult = () => {
    if (!currentResult) return;

    let text = "";
    if (mode === "teams" && Array.isArray(currentResult[0])) {
      (currentResult as string[][]).forEach((team, index) => {
        text += `${t("tools.groupdraw.team")} ${index + 1}: ${team.join(", ")}\n`;
      });
    } else {
      text = (currentResult as string[]).join(", ");
    }

    navigator.clipboard.writeText(text);
    toast.success(t("tools.groupdraw.resultCopied"));
  };

  const handleCopyHistory = (item: DrawResult) => {
    let text = "";
    if (item.mode === "teams" && Array.isArray(item.result[0])) {
      (item.result as string[][]).forEach((team, index) => {
        text += `${t("tools.groupdraw.team")} ${index + 1}: ${team.join(", ")}\n`;
      });
    } else {
      text = (item.result as string[]).join(", ");
    }

    navigator.clipboard.writeText(text);
    toast.success(t("tools.groupdraw.resultCopied"));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("groupDrawHistory");
    toast.success(t("tools.groupdraw.historyCleared"));
  };

  const renderResult = () => {
    if (!currentResult) return null;

    if (mode === "teams" && Array.isArray(currentResult[0])) {
      return (
        <div className="space-y-4">
          {(currentResult as string[][]).map((team, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t("tools.groupdraw.team")} {index + 1}
                  <Badge variant="secondary">{team.length}{t("tools.groupdraw.people")}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {team.map((person, pIndex) => (
                    <Badge key={pIndex} variant="outline" className="text-sm px-3 py-1">
                      {person}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else {
      return (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              {t("tools.groupdraw.winners")}
              <Badge variant="secondary">{(currentResult as string[]).length}{t("tools.groupdraw.people")}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(currentResult as string[]).map((person, index) => (
                <Badge key={index} variant="default" className="text-sm px-3 py-1">
                  {index + 1}. {person}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  const renderHistoryItem = (item: DrawResult) => {
    const date = new Date(item.timestamp).toLocaleString();
    
    return (
      <Card key={item.id}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              {item.mode === "teams" ? (
                <>
                  <Users className="h-4 w-4" />
                  {item.teamCount}{t("tools.groupdraw.teamDivision")}
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  {item.winnerCount}{t("tools.groupdraw.winnerSelection")}
                </>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyHistory(item)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">{date}</CardDescription>
        </CardHeader>
        <CardContent>
          {item.mode === "teams" && Array.isArray(item.result[0]) ? (
            <div className="space-y-2 text-sm">
              {(item.result as string[][]).map((team, index) => (
                <div key={index}>
                  <span className="font-semibold">{t("tools.groupdraw.team")} {index + 1}:</span>{" "}
                  {team.join(", ")}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm">
              {(item.result as string[]).join(", ")}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("tools.groupdraw.pageTitle")}</h1>
        <p className="text-muted-foreground">{t("tools.groupdraw.pageDescription")}</p>
      </div>

      <Tabs value={mode} onValueChange={(value) => setMode(value as DrawMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("tools.groupdraw.teamMode")}
          </TabsTrigger>
          <TabsTrigger value="winners" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            {t("tools.groupdraw.winnerMode")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("tools.groupdraw.settings")}</CardTitle>
              <CardDescription>{t("tools.groupdraw.teamModeDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("tools.groupdraw.participants")}
                </label>
                <Textarea
                  value={participantsText}
                  onChange={(e) => setParticipantsText(e.target.value)}
                  placeholder={t("tools.groupdraw.participantsPlaceholder")}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {t("tools.groupdraw.participantCount")}: {getParticipants().length}{t("tools.groupdraw.people")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("tools.groupdraw.teamCountLabel")}
                </label>
                <Input
                  type="number"
                  min={2}
                  max={getParticipants().length || 10}
                  value={teamCount}
                  onChange={(e) => setTeamCount(parseInt(e.target.value) || 2)}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="winners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("tools.groupdraw.settings")}</CardTitle>
              <CardDescription>{t("tools.groupdraw.winnerModeDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("tools.groupdraw.participants")}
                </label>
                <Textarea
                  value={participantsText}
                  onChange={(e) => setParticipantsText(e.target.value)}
                  placeholder={t("tools.groupdraw.participantsPlaceholder")}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {t("tools.groupdraw.participantCount")}: {getParticipants().length}{t("tools.groupdraw.people")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("tools.groupdraw.winnerCountLabel")}
                </label>
                <Input
                  type="number"
                  min={1}
                  max={getParticipants().length || 10}
                  value={winnerCount}
                  onChange={(e) => setWinnerCount(parseInt(e.target.value) || 1)}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button onClick={handleDraw} size="lg" className="flex-1">
          <Shuffle className="h-5 w-5 mr-2" />
          {t("tools.groupdraw.drawButton")}
        </Button>
        {currentResult && (
          <Button onClick={handleCopyResult} size="lg" variant="outline">
            <Copy className="h-5 w-5" />
          </Button>
        )}
      </div>

      {currentResult && (
        <div>
          <h2 className="text-xl font-bold mb-4">{t("tools.groupdraw.result")}</h2>
          {renderResult()}
        </div>
      )}

      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t("tools.groupdraw.history")}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("tools.groupdraw.clearHistory")}
            </Button>
          </div>
          <div className="space-y-3">
            {history.map(item => renderHistoryItem(item))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("tools.groupdraw.howToUse")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• {t("tools.groupdraw.step1")}</p>
          <p>• {t("tools.groupdraw.step2")}</p>
          <p>• {t("tools.groupdraw.step3")}</p>
          <p>• {t("tools.groupdraw.step4")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
