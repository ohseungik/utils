"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Shield, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

interface StrengthInfo {
  score: number;
  label: string;
  color: string;
}

export default function PasswordGenerator() {
  const { t } = useLanguage();
  const [password, setPassword] = useState<string>("");
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState<boolean>(false);

  const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  const NUMBERS = "0123456789";
  const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Generate password using Web Crypto API for secure randomness
  const generatePassword = () => {
    let charset = "";
    let generatedPassword = "";

    if (options.uppercase) charset += UPPERCASE;
    if (options.lowercase) charset += LOWERCASE;
    if (options.numbers) charset += NUMBERS;
    if (options.symbols) charset += SYMBOLS;

    if (charset.length === 0) {
      toast.error(t("tools.password.noOptionsError"));
      return;
    }

    // Use Web Crypto API for cryptographically secure random numbers
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);

    for (let i = 0; i < options.length; i++) {
      generatedPassword += charset[array[i] % charset.length];
    }

    setPassword(generatedPassword);
    setCopied(false);
    toast.success(t("tools.password.generated"));
  };

  // Calculate password strength
  const calculateStrength = (): StrengthInfo => {
    if (!password) {
      return { score: 0, label: t("tools.password.strengthNone"), color: "bg-gray-400" };
    }

    let score = 0;
    const length = password.length;

    // Length points
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (length >= 20) score += 1;

    // Character variety points
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) {
      return { score, label: t("tools.password.strengthWeak"), color: "bg-red-500" };
    } else if (score <= 4) {
      return { score, label: t("tools.password.strengthFair"), color: "bg-orange-500" };
    } else if (score <= 6) {
      return { score, label: t("tools.password.strengthGood"), color: "bg-yellow-500" };
    } else {
      return { score, label: t("tools.password.strengthStrong"), color: "bg-green-500" };
    }
  };

  const handleCopy = async () => {
    if (!password) {
      toast.error(t("tools.password.noPasswordError"));
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success(t("tools.password.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("tools.password.copyError"));
    }
  };

  const handleOptionChange = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  // Generate password on mount and when options change
  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.length, options.uppercase, options.lowercase, options.numbers, options.symbols]);

  const strength = calculateStrength();
  const atLeastOneOption = options.uppercase || options.lowercase || options.numbers || options.symbols;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            {t("tools.password.title")}
          </CardTitle>
          <CardDescription>{t("tools.password.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Display */}
          <div className="space-y-3">
            <Label>{t("tools.password.generatedPassword")}</Label>
            <div className="flex gap-2">
              <Input
                value={password}
                readOnly
                className="font-mono text-lg"
                placeholder={t("tools.password.placeholder")}
              />
              <Button onClick={handleCopy} variant="outline" size="icon">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button onClick={generatePassword} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {password && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t("tools.password.strength")}:</span>
                <Badge className={`${strength.color} text-white`}>
                  {strength.label}
                </Badge>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${(strength.score / 8) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Password Options */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="length">{t("tools.password.length")}</Label>
                <span className="text-sm font-mono font-semibold">{options.length} {t("tools.password.characters")}</span>
              </div>
              <Slider
                id="length"
                min={4}
                max={64}
                step={1}
                value={[options.length]}
                onValueChange={(value) => handleOptionChange("length", value[0])}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="uppercase">{t("tools.password.uppercase")}</Label>
                  <p className="text-xs text-muted-foreground">A-Z</p>
                </div>
                <Switch
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={(checked) => handleOptionChange("uppercase", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="lowercase">{t("tools.password.lowercase")}</Label>
                  <p className="text-xs text-muted-foreground">a-z</p>
                </div>
                <Switch
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={(checked) => handleOptionChange("lowercase", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="numbers">{t("tools.password.numbers")}</Label>
                  <p className="text-xs text-muted-foreground">0-9</p>
                </div>
                <Switch
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={(checked) => handleOptionChange("numbers", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="symbols">{t("tools.password.symbols")}</Label>
                  <p className="text-xs text-muted-foreground">!@#$%</p>
                </div>
                <Switch
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={(checked) => handleOptionChange("symbols", checked)}
                />
              </div>
            </div>

            {!atLeastOneOption && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  {t("tools.password.warningNoOptions")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle>{t("tools.password.securityTips")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t("tools.password.tip1Title")}</h4>
                <p className="text-sm text-muted-foreground">{t("tools.password.tip1Description")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t("tools.password.tip2Title")}</h4>
                <p className="text-sm text-muted-foreground">{t("tools.password.tip2Description")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t("tools.password.tip3Title")}</h4>
                <p className="text-sm text-muted-foreground">{t("tools.password.tip3Description")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t("tools.password.tip4Title")}</h4>
                <p className="text-sm text-muted-foreground">{t("tools.password.tip4Description")}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-2 border-t">
            {t("tools.password.disclaimer")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
