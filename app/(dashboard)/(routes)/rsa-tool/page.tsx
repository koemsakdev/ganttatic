"use client";
import { useState } from "react";

import {
  rsaAesEncryption,
  rsaAesDecryption,
  EXAMPLE_PUBLIC_KEY,
  EXAMPLE_PRIVATE_KEY,
  EXAMPLE_PLAINTEXT,
} from "@/lib/rsaEncryption";
import { useToast } from "@/hooks/useToast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Lock,
  Unlock,
  Copy,
  Check,
  Key,
  FileText,
  Info,
  Sparkles,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

type ModeType = "encrypt" | "decrypt";
const RsaTool = () => {
  const [mode, setMode] = useState<ModeType>("encrypt");
  const [keyInput, setKeyInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const toast = useToast();

  const handleModeChange = (newMode: string) => {
    setMode(newMode as ModeType);
    setKeyInput("");
    setTextInput("");
    setOutput("");
    setCopied(false);
  };

  const handleLoadExample = async () => {
    if (mode === "encrypt") {
      setKeyInput(EXAMPLE_PUBLIC_KEY);
      setTextInput(EXAMPLE_PLAINTEXT);
      toast.showToast("Example loaded", "Sample RSA public key and plaintext have been populated.", "success");
    } else {
      // For decrypt mode, we need to first encrypt the example to get encrypted text
      try {
        const encrypted = await rsaAesEncryption(
          EXAMPLE_PLAINTEXT,
          EXAMPLE_PUBLIC_KEY,
        );
        setKeyInput(EXAMPLE_PRIVATE_KEY);
        setTextInput(encrypted);
        toast.showToast(
          "Example loaded",
          "Sample RSA private key and encrypted text have been populated.",
          "success",
        );
      } catch (error) {
        toast.showToast(
          "Failed to load example",
          "Could not generate example encrypted text.",
          "error"
        );
      }
    }
  };

  const handleClearAll = () => {
    setKeyInput("");
    setTextInput("");
    setOutput("");
    setCopied(false);
    toast.showToast("Cleared", "All fields have been reset.", "success");
  };

  const handleProcess = async () => {
    if (!keyInput.trim()) {
      toast.showToast(
        `${mode === "encrypt" ? "Public" : "Private"} key required`,
        `Please enter a valid RSA ${mode === "encrypt" ? "public" : "private"} key in base64 format.`,
        "error"
      );
      return;
    }
    if (!textInput.trim()) {
      toast.showToast(
        `${mode === "encrypt" ? "Plaintext" : "Encrypted text"} required`,
        `Please enter some ${mode === "encrypt" ? "text to encrypt" : "encrypted text to decrypt"}.`,
        "error"
      );
      return;
    }

    setIsProcessing(true);
    setCopied(false);

    try {
      let result: string;
      if (mode === "encrypt") {
        result = await rsaAesEncryption(textInput, keyInput);
        toast.showToast(
          "Encryption successful",
          "Your text has been encrypted successfully.",
          "success"
        )
      } else {
        result = await rsaAesDecryption(textInput, keyInput);
        toast.showToast(
          "Decryption successful",
          "Your text has been decrypted successfully.",
          "success"
        );
      }
      setOutput(result);
    } catch (error) {
      toast.showToast(
        `${mode === "encrypt" ? "Encryption" : "Decryption"} failed`,
        error instanceof Error
          ? error.message
          : `An error occurred during ${mode === "encrypt" ? "encryption" : "decryption"}.`,
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.showToast(
        "Copied to clipboard",
        `${mode === "encrypt" ? "Encrypted" : "Decrypted"} output has been copied.`,
        "success"
      );

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.showToast(
        "Copy failed",
        "Failed to copy to clipboard.",
        "error"
      );
    }
  };

  const isEncryptMode = mode === "encrypt";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1
                className="text-3xl font-bold tracking-tight"
                data-testid="text-title"
              >
                RSA Crypto Simulator
              </h1>
              <p className="text-sm text-muted-foreground">
                Test RSA-OAEP encryption & decryption with SHA-256
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* <ThemeToggle /> */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              data-testid="button-clear-all"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 hover-elevate"
              data-testid="button-toggle-info"
            >
              <Info className="h-4 w-4" />
              Technical Information
              <Badge variant="secondary" className="ml-auto">
                {isInfoOpen ? "Hide" : "Show"}
              </Badge>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Algorithm</h4>
                  <p className="text-sm text-muted-foreground">
                    RSA-OAEP (Optimal Asymmetric Encryption Padding) with
                    SHA-256 hash function and MGF1 mask generation function
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Key Formats</h4>
                  <p className="text-sm text-muted-foreground">
                    Public Key: SPKI (SubjectPublicKeyInfo) format, also known
                    as X.509
                    <br />
                    Private Key: PKCS#8 format - both base64 encoded
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">
                    Compatibility
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Matches Java's RSA/ECB/OAEPWithSHA-256AndMGF1Padding
                    encryption scheme
                  </p>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Tabs
        value={mode}
        onValueChange={handleModeChange}
        className="space-y-6"
      >
        <TabsList
          className="grid w-full grid-cols-2"
          data-testid="tabs-mode-selector"
        >
          <TabsTrigger
            value="encrypt"
            className="gap-2"
            data-testid="tab-encrypt"
          >
            <Lock className="h-4 w-4" />
            Encrypt
          </TabsTrigger>
          <TabsTrigger
            value="decrypt"
            className="gap-2"
            data-testid="tab-decrypt"
          >
            <Unlock className="h-4 w-4" />
            Decrypt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-6">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  Encryption Configuration
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadExample}
                  data-testid="button-load-example-encrypt"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Load Example
                </Button>
              </div>
              <CardDescription>
                Enter your RSA public key and the text you want to encrypt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="encrypt-key"
                  className="text-sm font-medium uppercase"
                >
                  RSA Public Key (Base64)
                </Label>
                <Textarea
                  id="encrypt-key"
                  placeholder="Paste your RSA public key in base64 format here..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="min-h-32  text-sm resize-none w-full rounded-sm shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                  data-testid="input-key-encrypt"
                />
                <p className="text-xs text-muted-foreground">
                  SPKI format (X.509) base64-encoded public key
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="encrypt-text"
                  className="text-sm font-medium uppercase"
                >
                  Plaintext to Encrypt
                </Label>
                <Textarea
                  id="encrypt-text"
                  placeholder="Enter the text you want to encrypt..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-24 resize-none w-full rounded-sm shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                  data-testid="input-text-encrypt"
                />
                <p className="text-xs text-muted-foreground">
                  {textInput.length} character
                  {textInput.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-6">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  Decryption Configuration
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadExample}
                  data-testid="button-load-example-decrypt"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Load Example
                </Button>
              </div>
              <CardDescription>
                Enter your RSA private key and the encrypted text you want to
                decrypt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="decrypt-key"
                  className="text-sm font-medium uppercase"
                >
                  RSA Private Key (Base64)
                </Label>
                <Textarea
                  id="decrypt-key"
                  placeholder="Paste your RSA private key in base64 format here..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="min-h-32 text-sm resize-none w-full rounded-sm shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                  data-testid="input-key-decrypt"
                />
                <p className="text-xs text-muted-foreground">
                  PKCS#8 format base64-encoded private key
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="decrypt-text"
                  className="text-sm font-medium uppercase"
                >
                  Encrypted Text (Base64)
                </Label>
                <Textarea
                  id="decrypt-text"
                  placeholder="Paste the encrypted text in base64 format here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-24  text-sm resize-none w-full rounded-sm shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                  data-testid="input-text-decrypt"
                />
                <p className="text-xs text-muted-foreground">
                  {textInput.length} character
                  {textInput.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <div className="flex justify-center flex-wrap">
          <Button
            variant={"secondary"}
            onClick={handleProcess}
            disabled={isProcessing || !keyInput.trim() || !textInput.trim()}
            className="w-full rounded-sm bg-slate-300 hover:bg-slate-400 text-slate-900 dark:bg-gray-700 hover:dark:bg-gray-800 dark:text-slate-100"
            data-testid="button-process"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEncryptMode ? "Encrypting..." : "Decrypting..."}
              </>
            ) : (
              <div className="flex items-center gap-2">
                {isEncryptMode ? (
                  <Lock className="size-4 mb-1" />
                ) : (
                  <Unlock className="size-4 mb-1" />
                )}
                {isEncryptMode ? "Encrypt" : "Decrypt"}
              </div>
            )}
          </Button>
        </div>

        {output && (
          <Card className="border-primary/20">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  {isEncryptMode ? "Encrypted" : "Decrypted"} Output
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  data-testid="button-copy"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                {isEncryptMode
                  ? "Base64-encoded encrypted result"
                  : "Decrypted plaintext result"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4">
                <pre
                  className={`whitespace-pre-wrap break-all ${isEncryptMode ? "" : ""} text-sm`}
                  data-testid="text-output"
                >
                  {output}
                </pre>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Output length: {output.length} character
                {output.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        )}
      </Tabs>
    </div>
  )
}

export default RsaTool