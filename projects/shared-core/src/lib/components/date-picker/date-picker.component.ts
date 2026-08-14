import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonicModule,
    ModalController
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
    closeOutline,
    checkmarkOutline,
    chevronBackOutline,
    chevronForwardOutline,
    timeOutline
} from 'ionicons/icons';

import { AppMessageCode } from '../../constants/app-message-code.enum';
import { ErrorHandlerService } from '../../services/error-handler.service';


export interface DayGridItem {
    date: Date;
    dayNumber: number;
    isCurrentMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
}

export interface DatePickerResult {
    date: string;
}

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ]
})
export class DatePickerComponent implements OnInit {

    /** Parámetros de entrada recibidos desde el modalController */
    @Input() initialDate?: string;
    @Input() includeTime: boolean = true;
    @Input() title: string = 'SELECCIONAR FECHA';

    // Fechas de control interno
    public viewDate: Date = new Date();
    public selectedDate: Date = new Date();

    // Controladores de hora y minutos
    public selectedHour: string = '12';
    public selectedMinute: string = '00';

    // Listas desplegables para los combos de tiempo
    public hoursList: string[] = [];
    public minutesList: string[] = [];

    // Mapeos y datos para la renderización del calendario
    public weekDays: string[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    public daysGrid: DayGridItem[] = [];
    public currentMonthLabel: string = '';

    constructor(
        private modalCtrl: ModalController,
        private errorHandler: ErrorHandlerService
    ) {
        addIcons({
            closeOutline,
            checkmarkOutline,
            chevronBackOutline,
            chevronForwardOutline,
            timeOutline
        });
        this.generateTimeOptions();
    }

    ngOnInit(): void {
        try {
            // Validar si la fecha recibida es válida
            const inputDate = this.initialDate ? new Date(this.initialDate) : new Date();
            const validDate = !isNaN(inputDate.getTime()) ? inputDate : new Date();

            this.selectedDate = new Date(validDate);
            this.viewDate = new Date(validDate);

            // Formatear horas y minutos iniciales
            this.selectedHour = String(validDate.getHours()).padStart(2, '0');
            const mins = Math.round(validDate.getMinutes() / 5) * 5;
            this.selectedMinute = String(mins >= 60 ? 55 : mins).padStart(2, '0');

            // Dibujar la rejilla de días
            this.renderCalendar();
        } catch (error) {
            this.errorHandler.handle(error, AppMessageCode.ADC_DP_ERR_0001);
        }
    }

    /**
     * Genera los arrays con las opciones para las horas (00-23) y minutos (intervalos de 5 min)
     */
    private generateTimeOptions(): void {
        this.hoursList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
        this.minutesList = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
    }

    /**
     * Genera la rejilla de 42 días (6 semanas) para el mes en vista
     */
    public renderCalendar(): void {
        try {
            const year = this.viewDate.getFullYear();
            const month = this.viewDate.getMonth();

            // Formato de cabecera (ej: "Julio 2026")
            const monthName = this.viewDate.toLocaleString('es-ES', { month: 'long' });
            this.currentMonthLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

            const firstDayOfMonth = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0);

            // Calcular el día de la semana (ajustado para que Lunes sea 0)
            let startingDay = firstDayOfMonth.getDay() - 1;
            if (startingDay === -1) startingDay = 6;

            const grid: DayGridItem[] = [];
            const today = new Date();

            // 1. Rellenar días del mes anterior
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            for (let i = startingDay - 1; i >= 0; i--) {
                const d = new Date(year, month - 1, prevMonthLastDay - i);
                grid.push({
                    date: d,
                    dayNumber: d.getDate(),
                    isCurrentMonth: false,
                    isSelected: this.isSameDay(d, this.selectedDate),
                    isToday: this.isSameDay(d, today)
                });
            }

            // 2. Rellenar días del mes actual
            for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
                const d = new Date(year, month, i);
                grid.push({
                    date: d,
                    dayNumber: i,
                    isCurrentMonth: true,
                    isSelected: this.isSameDay(d, this.selectedDate),
                    isToday: this.isSameDay(d, today)
                });
            }

            // 3. Rellenar días del mes siguiente para completar 42 celdas
            const remainingCells = 42 - grid.length;
            for (let i = 1; i <= remainingCells; i++) {
                const d = new Date(year, month + 1, i);
                grid.push({
                    date: d,
                    dayNumber: i,
                    isCurrentMonth: false,
                    isSelected: this.isSameDay(d, this.selectedDate),
                    isToday: this.isSameDay(d, today)
                });
            }

            this.daysGrid = grid;
        } catch (error) {
            this.errorHandler.handle(error, AppMessageCode.ADC_DP_ERR_0002);
        }
    }

    /**
     * Cambia el mes visualizado (+1 o -1)
     */
    public changeMonth(offset: number): void {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + offset, 1);
        this.renderCalendar();
    }

    /**
     * Selecciona un día concreto en el calendario
     */
    public selectDay(dayItem: DayGridItem): void {
        this.selectedDate = new Date(dayItem.date);
        if (!dayItem.isCurrentMonth) {
            this.viewDate = new Date(dayItem.date);
        }
        this.renderCalendar();
    }

    /**
     * Sincroniza la hora y los minutos seleccionados
     */
    public onTimeChange(): void {
        this.selectedDate.setHours(parseInt(this.selectedHour, 10));
        this.selectedDate.setMinutes(parseInt(this.selectedMinute, 10));
    }

    /**
     * Confirma la fecha elegida y la devuelve al componente padre
     */
    public async confirm(): Promise<boolean> {
        try {
            const finalDate = new Date(this.selectedDate);

            if (this.includeTime) {
                finalDate.setHours(parseInt(this.selectedHour, 10), parseInt(this.selectedMinute, 10), 0, 0);
            } else {
                finalDate.setHours(0, 0, 0, 0);
            }

            return await this.modalCtrl.dismiss({ date: finalDate.toISOString() }, 'confirm');
        } catch (error) {
            this.errorHandler.handle(error, AppMessageCode.ADC_DP_ERR_0003);
            return false;
        }
    }

    /**
     * Cierra el modal sin guardar cambios
     */
    public async cancel(): Promise<boolean> {
        return await this.modalCtrl.dismiss(null, 'cancel');
    }

    /**
     * Compara si dos objetos Date representan el mismo día
     */
    private isSameDay(d1: Date, d2: Date): boolean {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }
}