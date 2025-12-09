import { Component, OnInit } from '@angular/core';
import { MascotasService } from '../../services/mascotas.service';
import { Mascota } from '../../models/mascota.model';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.css'],
  standalone: false
})
export class MascotasComponent implements OnInit {
  mascotas: Mascota[] = [];
  mascotaForm: Mascota = {
    nombre: '',
    especie: '',
    raza: '',
    edad: 0,
    dueno: ''
  };
  mascotaEditando: Mascota | null = null;

  constructor(private mascotasService: MascotasService) {}

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.mascotasService.getMascotas().subscribe({
      next: (data) => {
        this.mascotas = data;
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al cargar mascotas');
      }
    });
  }

  guardarMascota(): void {
    if (this.mascotaEditando && this.mascotaEditando._id) {
      this.mascotasService.actualizarMascota(this.mascotaEditando._id, this.mascotaForm).subscribe({
        next: () => {
          this.cargarMascotas();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error:', err)
      });
    } else {
      this.mascotasService.crearMascota(this.mascotaForm).subscribe({
        next: () => {
          this.cargarMascotas();
          this.limpiarFormulario();
        },
        error: (err) => console.error('Error:', err)
      });
    }
  }

  editarMascota(mascota: Mascota): void {
    this.mascotaEditando = mascota;
    this.mascotaForm = { ...mascota };
  }

  eliminarMascota(id: string | undefined): void {
    if (!id) return;
    if (confirm('¿Eliminar esta mascota?')) {
      this.mascotasService.eliminarMascota(id).subscribe({
        next: () => this.cargarMascotas(),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  limpiarFormulario(): void {
    this.mascotaForm = {
      nombre: '',
      especie: '',
      raza: '',
      edad: 0,
      dueno: ''
    };
    this.mascotaEditando = null;
  }
}
