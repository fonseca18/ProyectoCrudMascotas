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
  edadMinima: number = 0;
  edadMaxima: number = 50;
  searchTerm: string = '';

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
    if (!this.esFormularioValido()) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

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

  cancelarEdicion(): void {
    this.limpiarFormulario();
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

  esFormularioValido(): boolean {
    return (
      this.mascotaForm.nombre.trim() !== '' &&
      this.mascotaForm.especie.trim() !== '' &&
      this.mascotaForm.raza.trim() !== '' &&
      this.mascotaForm.edad >= this.edadMinima &&
      this.mascotaForm.edad <= this.edadMaxima &&
      this.mascotaForm.dueno.trim() !== ''
    );
  }

  isNombreValido(): boolean {
    return this.mascotaForm.nombre.trim() !== '';
  }

  isEspecieValido(): boolean {
    return this.mascotaForm.especie.trim() !== '';
  }

  isRazaValida(): boolean {
    return this.mascotaForm.raza.trim() !== '';
  }

  isEdadValida(): boolean {
    return this.mascotaForm.edad >= this.edadMinima && this.mascotaForm.edad <= this.edadMaxima;
  }

  isDuenoValido(): boolean {
    return this.mascotaForm.dueno.trim() !== '';
  }

  obtenerMascotasFiltradas(): Mascota[] {
    if (!this.searchTerm.trim()) {
      return this.mascotas;
    }
    return this.mascotas.filter(m =>
      m.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      m.especie.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      m.dueno.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
