import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'app-icon-selector',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        PopoverModule,
        FormsModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule
    ],
    templateUrl: './icon-selector.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IconSelectorComponent),
            multi: true
        }
    ]
})
export class IconSelectorComponent implements ControlValueAccessor {
    @Input() placeholder: string = 'Selecciona un icono';

    @ViewChild('iconPanel') iconPanel!: Popover;

    value: string = '';
    isDisabled: boolean = false;

    onChange = (value: string) => { };
    onTouched = () => { };

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

    // ControlValueAccessor methods
    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    toggle(event: Event): void {
        if (this.isDisabled) return;
        event.stopPropagation(); // Prevent bubbling issues
        this.iconPanel.toggle(event);
    }

    onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange(this.value);
        this.onTouched();
    }

    selectIcon(emoji: string): void {
        this.value = emoji;
        this.onChange(emoji);
        this.onTouched();
        this.iconPanel.hide();
    }
}
