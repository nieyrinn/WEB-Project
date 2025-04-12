// src/app/components/vacancy-list/vacancy-list.component.ts
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Vacancy } from '../../interfaces/vacancy';
import { VacancyService } from '../../services/vacancy.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-vacanciest',
  imports: [CommonModule, RouterModule],
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})
export class VacanciesComponent implements OnChanges {
  companyId!: number;
  vacancies: Vacancy[] = [];

  constructor(private vacancyService: VacancyService, private route: ActivatedRoute, private router: Router) { }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.companyId = +this.route.snapshot.paramMap.get('id')!;
    this.loadVacancies();
  }

  loadVacancies(): void {
    this.vacancyService.getVacanciesByCompanyId(this.companyId).subscribe(
      (data: Vacancy[]) => {
        this.vacancies = data;
      },
      (error: any) => {
        console.error('Error fetching vacancies:', error);
      }
    );
  }
}