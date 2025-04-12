// src/app/components/company-list/company-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Company } from '../../interfaces/company';
import { CompanyService } from '../../services/company.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-companies',
  imports: [CommonModule, RouterModule],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  selectedCompanyId: number | null = null;

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe(
      (data) => {
        this.companies = data;
      },
      (error) => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  selectCompany(id: number): void {
    this.selectedCompanyId = id;
  }
}