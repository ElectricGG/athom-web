import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';

@Component({
    selector: 'app-icon-selector',
    standalone: true,
    imports: [CommonModule, ButtonModule, PopoverModule],
    templateUrl: './icon-selector.component.html'
})
export class IconSelectorComponent {
    @Input() currentIcon: string = '📋';
    @Output() iconSelected = new EventEmitter<string>();

    @ViewChild('iconPanel') iconPanel!: Popover;

    // Emoji Categories - Reusable constant
    readonly emojiCategories = [
        {
            name: 'Finanzas',
            emojis: ['💰', '💳', '💵', '💸', '🏦', '🧾', '📊', '📉', '📈', '💹', '💲', '🏧']
        },
        {
            name: 'Hogar',
            emojis: ['🏠', '🏡', '💡', '💧', '🔥', '📡', '📱', '💻', '🛒', '🧺', '🔧', '🔨']
        },
        {
            name: 'Transporte',
            emojis: ['🚗', '🚕', '🚌', '🚆', '✈️', '⛽', '🅿️', '🚦', '🔧', '🚲', '🛴', '🛵']
        },
        {
            name: 'Salud',
            emojis: ['💊', '🩺', '🏥', '🚑', '🦷', '👓', '🧘', '💪', '🍎', '🥗', '🏋️', '🏃']
        },
        {
            name: 'Entretenimiento',
            emojis: ['🎬', '🍿', '🎮', '🎵', '🎧', '📺', '📚', '🎨', '🎭', '🎫', '🎪', '⚽']
        },
        {
            name: 'Otros',
            emojis: ['🎒', '🎓', '🎁', '🎈', '🎉', '✈️', '🛎️', '📅', '📝', '💼', '🔒', '🔑', '🎯', '🛡️', '💍', '🏥']
        }
    ];

    toggle(event: Event): void {
        this.iconPanel.toggle(event);
    }

    selectIcon(emoji: string): void {
        this.currentIcon = emoji;
        this.iconSelected.emit(emoji);
        this.iconPanel.hide();
    }
}
