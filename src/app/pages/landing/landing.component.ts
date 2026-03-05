import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works.component';
import { FeaturesCarouselComponent } from '../../components/features-carousel/features-carousel.component';
import { VideoDemoComponent } from '../../components/video-demo/video-demo.component';
import { PricingComponent } from '../../components/pricing/pricing.component';
import { BenefitsComponent } from '../../components/benefits/benefits.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { CtaFinalComponent } from '../../components/cta-final/cta-final.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { DashboardPreview } from '../../components/dashboard-preview/dashboard-preview';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    HowItWorksComponent,
    FeaturesCarouselComponent,
    VideoDemoComponent,
    PricingComponent,
    BenefitsComponent,
    FaqComponent,
    CtaFinalComponent,
    FooterComponent,
    DashboardPreview
  ],
  templateUrl: './landing.component.html'
})
export class LandingComponent { }
