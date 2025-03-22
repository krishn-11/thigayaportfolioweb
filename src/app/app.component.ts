import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule,ReactiveFormsModule, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'AngularPortfolio';
  name: string = '';
  email: string = '';
  subject: string = '';
  message: string = '';
  showSnackbar: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeNavbar();
      this.navToggler();
      this.scrollSectionActiveLink();
      this.portfolioFilter();
      this.skillsAnimation();
      this.initLightbox();
      // this.toastr.success('Hello from Toastr!', '✅ Test Successful');

    }
  }

  // ngOnInit() {
  //   this.toastr.success('Hello from Toastr!', '✅ Test Successful');
  // }
  

  showSuccess() {
    this.toastr.success('Approval successfully!', '✅ Success');
  }

  showError() {
    this.toastr.error('Something went wrong!', '❌ Error');
  }

  // ===== Resize Navbar on Scroll =====
  resizeNavbar() {
    if (isPlatformBrowser(this.platformId)) {
      const navbar = document.querySelector('.navbar')!;
      this.renderer.listen(window, 'scroll', () => {
        if (window.scrollY > 20) {
          this.renderer.addClass(navbar, 'sticky');
        } else {
          this.renderer.removeClass(navbar, 'sticky');
        }
      });
    }
  }

  // ===== Nav Toggler =====
  navToggler() {
    if (isPlatformBrowser(this.platformId)) {
      const navMenu = document.querySelector('.menu');
      const navToggle = document.querySelector('.menu-btn');
      if (navToggle) {
        navToggle.addEventListener('click', () => {
          navMenu?.classList.toggle('active');
        });
      }
      // Closing menu when a link is clicked
      const navLink = document.querySelectorAll('.nav-link');
      navLink.forEach((n) => n.addEventListener('click', this.linkAction));
    }
  }

  linkAction() {
    const navMenu = document.querySelector('.menu');
    navMenu?.classList.remove('active');
  }

  // ===== Scroll Section Active Link =====
  scrollSectionActiveLink() {
    if (isPlatformBrowser(this.platformId)) {
      const sections = document.querySelectorAll('section[id]');
      window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach((current) => {
          const section = current as HTMLElement;
          const sectionHeight = section.offsetHeight;
          const sectionTop = section.offsetTop - 50;
          const sectionId = section.getAttribute('id');
          if (
            scrollY > sectionTop &&
            scrollY <= sectionTop + sectionHeight &&
            sectionId
          ) {
            document
              .querySelector(`.links a[href*="${sectionId}"]`)
              ?.classList.add('active');
          } else {
            document
              .querySelector(`.links a[href*="${sectionId}"]`)
              ?.classList.remove('active');
          }
        });
      });
    }
  }

  // ===== Skills Animation =====
  skillsAnimation() {
    if (isPlatformBrowser(this.platformId)) {
      const skillsWrap = document.querySelector('.about-skills');
      const skillsBar = document.querySelectorAll('.progress-line');

      window.addEventListener('scroll', () => {
        if (this.checkScroll(skillsWrap)) {
          skillsBar.forEach((skill) => {
            const el = skill as HTMLElement;
            const progress = el.getAttribute('data-progress');
            if (progress) {
              el.style.width = progress;
            } else {
              el.style.width = '0';
            }
          });
        }
      });
    }
  }

  checkScroll(el: any) {
    if (el) {
      const rect = el.getBoundingClientRect();
      return window.innerHeight >= rect.top + el.offsetHeight;
    }
    return false;
  }

  // ===== Portfolio Item Filter =====
  portfolioFilter() {
    if (isPlatformBrowser(this.platformId)) {
      const filterContainer = document.querySelector('.portfolio-filter');
      const filterBtns = filterContainer?.children;
      const portfolioItems = document.querySelectorAll('.portfolio-item');

      if (filterBtns) {
        Array.from(filterBtns).forEach((btn) => {
          btn.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;

            filterContainer?.querySelector('.active')?.classList.remove('active');
            target.classList.add('active');

            const filterValue = target.getAttribute('data-filter');
            portfolioItems.forEach((item) => {
              const itemEl = item as HTMLElement;
              if (
                filterValue === itemEl.getAttribute('data-category') ||
                filterValue === 'all'
              ) {
                itemEl.classList.remove('hide');
                itemEl.classList.add('show');
              } else {
                itemEl.classList.remove('show');
                itemEl.classList.add('hide');
              }
            });
          });
        });
      }
    }
  }

  // ===== Lightbox =====
  initLightbox() {
    if (isPlatformBrowser(this.platformId)) {
      const lightbox = document.querySelector('.lightbox');
      const lightboxImg = lightbox?.querySelector(
        '.lightbox-img'
      ) as HTMLImageElement;
      const lightboxClose = lightbox?.querySelector('.lightbox-close');
      const lightboxText = lightbox?.querySelector('.caption-text');
      const lightboxCounter = lightbox?.querySelector('.caption-counter');
      const portfolioItems = document.querySelectorAll('.portfolio-item');

      let itemIndex = 0;

      portfolioItems.forEach((item, index) => {
        item?.addEventListener('click', () => {
          itemIndex = index;
          if (lightbox && lightboxImg && lightboxText && lightboxCounter) {
            this.changeItem(
              itemIndex,
              portfolioItems,
              lightboxImg,
              lightboxText,
              lightboxCounter
            );
            lightbox.classList.toggle('open');
          }
        });
      });

      lightboxClose?.addEventListener('click', () => {
        lightbox?.classList.remove('open');
      });
    }
  }

  changeItem(
    itemIndex: number,
    portfolioItems: NodeListOf<Element>,
    lightboxImg: HTMLImageElement,
    lightboxText: Element | null,
    lightboxCounter: Element | null
  ) {
    const imgSrc = portfolioItems[itemIndex]
      .querySelector('.portfolio-img img')
      ?.getAttribute('src');
    if (imgSrc) {
      lightboxImg.src = imgSrc;
    }
    if (lightboxText) {
      lightboxText.innerHTML =
        portfolioItems[itemIndex].querySelector('h4')!.innerHTML;
    }
    if (lightboxCounter) {
      lightboxCounter.innerHTML = `${itemIndex + 1} of ${portfolioItems.length}`;
    }
  }

  validateAndSubmit(form: NgForm) {
    if (form.invalid) {
      // Mark fields as touched to trigger error messages
      Object.keys(form.controls).forEach((field) => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });

      // Show error toaster if form is invalid
      this.toastr.error('Please fill all required fields correctly.', '❌ Error', {
        positionClass: 'toast-top-right',
        timeOut: 3000,
      });
      return; // Stop if form is invalid
    }

    // Form is valid - proceed with submission
    console.log('Form submitted successfully!', form.value);

    // Show success toaster
    this.toastr.success('Form submitted successfully!', '✅ Success', {
      positionClass: 'toast-top-right',
      timeOut: 3000,
    });

    // Reset the form after 1 second
    setTimeout(() => {
      form.resetForm();
    }, 1000);
  }
  

}
