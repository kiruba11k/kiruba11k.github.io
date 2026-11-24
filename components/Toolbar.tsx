"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Check, ChevronUp, ClipboardList, Crosshair, Grid2x2, Moon, Phone, Route, Sun, Target, Type, UserRound, Warehouse, Binary } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FONT_OPTIONS, usePrefs, type FontChoice, type RenderMode } from "@/lib/prefs";
import { SECTIONS, type SectionId } from "@/lib/content";

const ICONS: Record<SectionId, LucideIcon> = { player: UserRound, arsenal: Crosshair, missions: Target, heist: ClipboardList, story: Route, garage: Warehouse, contact: Phone };

function Tip({ label, kbd, children }: { label: string; kbd?: string; children: React.ReactNode }) {
  return <Tooltip.Root>
    <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content className="tip" side="top" sideOffset={10}>
        {label}{kbd && <kbd>{kbd}</kbd>}
        <Tooltip.Arrow className="tip-arrow" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>;
}

export default function Toolbar({ active, onJump }: { active: SectionId | null; onJump: (id: SectionId) => void }) {
  const { theme, setTheme, font, setFont, render, setRender } = usePrefs();
  const current = FONT_OPTIONS.find(f => f.id === font)!;
  return <Tooltip.Provider delayDuration={250} skipDelayDuration={100}>
    <div className="toolbar-wrap">
      <nav className="toolbar" aria-label="Site controls">
        <Tip label="Back to start" kbd="0">
          <button className="tb-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">KP</button>
        </Tip>
        <span className="tb-sep" />
        <div className="tb-group tb-nav">
          {SECTIONS.map((s, i) => {
            const Icon = ICONS[s.id];
            return <Tip key={s.id} label={s.name} kbd={String(i + 1)}>
              <button className={"tb-btn" + (active === s.id ? " is-active" : "")} aria-label={s.name} aria-current={active === s.id ? "true" : undefined} onClick={() => onJump(s.id)}>
                <Icon size={16} strokeWidth={1.75} />
              </button>
            </Tip>;
          })}
        </div>
        <span className="tb-sep" />
        <DropdownMenu.Root>
          <Tip label="Typeface">
            <DropdownMenu.Trigger className="tb-btn tb-font" aria-label={"Typeface: " + current.label}>
              <Type size={15} strokeWidth={1.75} /><span>{current.label}</span><ChevronUp size={12} className="tb-chev" />
            </DropdownMenu.Trigger>
          </Tip>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="menu" side="top" sideOffset={12} align="center">
              <DropdownMenu.Label className="menu-label">Typeface</DropdownMenu.Label>
              <DropdownMenu.RadioGroup value={font} onValueChange={v => setFont(v as FontChoice)}>
                {FONT_OPTIONS.map(f => <DropdownMenu.RadioItem key={f.id} value={f.id} className={"menu-item font-" + f.id}>
                  <span className="menu-aa">Aa</span><span className="menu-name">{f.label}</span><small>{f.sample}</small>
                  <DropdownMenu.ItemIndicator className="menu-check"><Check size={13} /></DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>)}
              </DropdownMenu.RadioGroup>
              <DropdownMenu.Arrow className="menu-arrow" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <ToggleGroup.Root type="single" className="tb-seg" value={render} onValueChange={v => v && setRender(v as RenderMode)} aria-label="Hero renderer">
          <Tip label="Dither render" kbd="M"><ToggleGroup.Item value="dither" className="tb-seg-item" aria-label="Dither"><Grid2x2 size={14} strokeWidth={1.75} /></ToggleGroup.Item></Tip>
          <Tip label="ASCII render" kbd="M"><ToggleGroup.Item value="ascii" className="tb-seg-item" aria-label="ASCII"><Binary size={14} strokeWidth={1.75} /></ToggleGroup.Item></Tip>
        </ToggleGroup.Root>
        <Tip label={theme === "night" ? "Switch to day" : "Switch to night"} kbd="T">
          <button className="tb-btn tb-theme" aria-label="Toggle theme" onClick={() => setTheme(theme === "night" ? "day" : "night")}>
            <span className="tb-theme-icon" data-theme-icon={theme}>{theme === "night" ? <Moon size={15} strokeWidth={1.75} /> : <Sun size={15} strokeWidth={1.75} />}</span>
          </button>
        </Tip>
      </nav>
    </div>
  </Tooltip.Provider>;
}
