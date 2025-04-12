import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Company } from '../../interfaces/company';
import { Vacancy } from '../../interfaces/vacancy';
import { CompanyService } from '../../services/company.service';
import { VacancyService } from '../../services/vacancy.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  companies: Company[] = [];
  vacancies: Vacancy[] = [];

  constructor(private c: CompanyService, private v: VacancyService) {}

  ngOnInit() {
    this.c.getCompanies().subscribe(data => 
      {
      this.companies = data;
    });
  }

  loadVacancies(companyId: number) {
    this.v.getVacanciesByCompanyId(companyId).subscribe(data => {
      this.vacancies = data;
    });
  }
}
