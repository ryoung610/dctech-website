import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('financeChart') financeChartRef!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | undefined;
  private resizeObserver: ResizeObserver | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
      this.setupResizeObserver();
    }
  }

  private initChart(): void {
    const ctx = this.financeChartRef?.nativeElement;
    if (ctx) {
      // Destroy existing chart if it exists
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Custom Software', 'Cloud Solutions', 'AI Solutions'],
          datasets: [{
            label: 'Revenue Increase (%)',
            data: [35, 25, 40],
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Percentage Increase' }
            }
          },
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: { label: (context) => `${context.dataset.label}: ${context.parsed.y}%` }
            }
          }
        }
      });
    } else {
      console.error('Chart canvas element not found');
    }
  }

  private setupResizeObserver(): void {
    if (isPlatformBrowser(this.platformId) && this.financeChartRef?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chartInstance) {
          this.chartInstance.resize(); // Resize chart when container changes
        }
      });
      this.resizeObserver.observe(this.financeChartRef.nativeElement.parentElement!); // Observe the container
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}