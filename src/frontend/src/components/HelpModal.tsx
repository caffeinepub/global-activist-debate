import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Users, Flag, Shield, Heart, Sparkles } from 'lucide-react';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] animate-in zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            Welcome to Global Activist Debate!
          </DialogTitle>
          <DialogDescription>
            Your guide to making the most of our platform
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="rules">Community Rules</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="getting-started" className="space-y-4 pr-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="profile">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-activist-blue" />
                      <span>Setting Up Your Profile</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>Create your unique activist identity:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Choose a username that represents you</li>
                      <li>Customize your avatar with skin tones, hairstyles, and accessories</li>
                      <li>Add your activist interests (climate, human rights, etc.)</li>
                      <li>Select your debate style (Civil, Aggressive, Creative, or Random)</li>
                      <li>Link your social media profiles (optional)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="posts">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-activist-green" />
                      <span>Creating Posts</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>Share your thoughts with the community:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Navigate to any section (Civil, Aggressive, Quotes, Random)</li>
                      <li>Write your message in the post creation form</li>
                      <li>Optionally attach images or media</li>
                      <li>Click "Post" to share with the community</li>
                      <li>Engage with others by liking and replying to posts</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sections">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-activist-orange" />
                      <span>Understanding Sections</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>Each section has its own vibe:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong>Civil Debate:</strong> Respectful, fact-based discussions</li>
                      <li><strong>Aggressive Debate:</strong> Passionate, heated exchanges</li>
                      <li><strong>Quotes & Poems:</strong> Creative expression and inspiration</li>
                      <li><strong>Random Debates:</strong> Spontaneous topics and fun discussions</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="following">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Following Users</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>Build your activist network:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Visit any user's profile page</li>
                      <li>Click the "Follow" button to stay updated</li>
                      <li>View your following list on your profile</li>
                      <li>Discover like-minded activists through posts and replies</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 pr-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="messaging">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-activist-blue" />
                      <span>Private Messaging</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>Connect privately with other activists:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Click "Messages" in the navigation bar</li>
                      <li>Start a new conversation with any user</li>
                      <li>Create group conversations for collaborative discussions</li>
                      <li>View conversation history and participants</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="debate-matching">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-activist-orange" />
                      <span>Random Debate Matching</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>Find debate partners instantly:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Click the "Find Random Debate Partner" button</li>
                      <li>Choose your preferred debate style</li>
                      <li>Get matched with someone who shares your interests</li>
                      <li>Start debating right away!</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reporting">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-red-500" />
                      <span>Reporting Content</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>Help keep our community safe:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Click the flag icon on any post or profile</li>
                      <li>Select the violation type (spam, harassment, etc.)</li>
                      <li>Provide a brief description</li>
                      <li>Our moderators will review your report promptly</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="customization">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-activist-green" />
                      <span>Avatar Customization</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>Express yourself with a unique avatar:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Choose from multiple skin tones</li>
                      <li>Select your hairstyle and color</li>
                      <li>Add accessories like glasses or hats</li>
                      <li>Pick your clothing style</li>
                      <li>Update your avatar anytime from your profile</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4 pr-4">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-activist-blue/10 border border-activist-blue/20">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-activist-blue mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Respect All Voices</h4>
                      <p className="text-sm text-muted-foreground">
                        Every activist deserves to be heard. Treat others with dignity, even when you disagree. Personal attacks, hate speech, and discrimination have no place here.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-activist-green/10 border border-activist-green/20">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-activist-green mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">No Spam or Self-Promotion</h4>
                      <p className="text-sm text-muted-foreground">
                        Keep content relevant and meaningful. Excessive self-promotion, spam, or off-topic posts disrupt our community and will be removed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-activist-orange/10 border border-activist-orange/20">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-activist-orange mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Debate with Integrity</h4>
                      <p className="text-sm text-muted-foreground">
                        Back up your arguments with facts and sources when possible. Misinformation undermines meaningful debate. Be honest and transparent.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <Flag className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Report, Don't Retaliate</h4>
                      <p className="text-sm text-muted-foreground">
                        If you see rule violations, use the report button. Don't engage in arguments with rule-breakers. Let our moderators handle it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">
                    <strong>Consequences:</strong> Violations may result in warnings, temporary suspensions, or permanent bans depending on severity. We believe in second chances but won't tolerate repeated abuse.
                  </p>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
