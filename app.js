(function() {
            'use strict';
            
            // Vérifier IMMÉDIATEMENT si on est hors ligne
            if (!navigator.onLine) {
                // Cacher tout le contenu immédiatement avec un style inline
                document.write('');
                
                // Créer l'écran d'erreur immédiatement
                document.write(`
                    <div id="offline-overlay" style="
                        position: fixed; inset: 0; z-index: 99999;
                        background-color: #f8fafc; display: flex;
                        align-items: center; justify-content: center;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        text-align: center; padding: 2rem;
                    ">
                        <div style="max-width: 400px;">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" 
                                 stroke="#6b7280" stroke-width="2" stroke-linecap="round" 
                                 stroke-linejoin="round" style="margin: 0 auto 1.5rem auto; display: block;">
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.94M1 10.7l2.16 1.86a2.3 2.3 0 0 1 2.97 0L10 16.25"></path>
                                <path d="M8 12.25l.89-.78a2.3 2.3 0 0 1 2.97 0l4.24 3.68"></path>
                                <path d="M4.26 10.13a10.94 10.94 0 0 0-1.26 2.81"></path>
                                <path d="M10.7 4.69A10.94 10.94 0 0 1 12.94 4"></path>
                                <path d="M16 18l1.11.96a2.3 2.3 0 0 0 2.97 0l1.86-1.6"></path>
                                <path d="M22 10.7c0 .16-.01.32-.03.48"></path>
                                <path d="M2 12.94a10.94 10.94 0 0 1 5-2.81"></path>
                                <path d="M21 15l-1-1"></path>
                                <path d="M3 3l1 1"></path>
                                <path d="M12.94 22a10.94 10.94 0 0 1-2.81-.26"></path>
                            </svg>
                            <h1 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">
                                Pas de Connexion
                            </h1>
                            <p style="font-size: 1rem; color: #6b7280; margin-bottom: 1.5rem;">
                                Cette application nécessite une connexion internet pour fonctionner. 
                                Veuillez vérifier votre réseau.
                            </p>
                            <button onclick="window.location.reload()" style="
                                background-color: #2563eb; color: white; border: none;
                                padding: 0.75rem 1.5rem; border-radius: 0.75rem;
                                font-size: 1rem; font-weight: 500; cursor: pointer;
                                -webkit-tap-highlight-color: transparent;
                            " onmouseover="this.style.backgroundColor='#1d4ed8'" 
                               onmouseout="this.style.backgroundColor='#2563eb'">
                                Réessayer
                            </button>
                        </div>
                    </div>
                `);
            }
        })();

// Initialisation Capacitor
        window.addEventListener('DOMContentLoaded', async () => {
            if (typeof Capacitor !== 'undefined') {
                console.log('✅ Capacitor initialisé');
                document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
                enableMobileImmersiveMode();
            }
        });

        function enableMobileImmersiveMode() {
            // Empêcher les gestes de zoom (pinch)
            document.addEventListener('gesturestart', function (e) {
                e.preventDefault();
            });
            
            document.addEventListener('gesturechange', function (e) {
                e.preventDefault();
            });
            
            document.addEventListener('gestureend', function (e) {
                e.preventDefault();
            });
            
            // Empêcher le double-tap zoom
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function (e) {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
            
            // Empêcher le pull-to-refresh
            let touchStartY = 0;
            let isScrolling = false;
            
            document.addEventListener('touchstart', function (e) {
                touchStartY = e.touches[0].clientY;
                isScrolling = false;
            }, { passive: true });
            
            document.addEventListener('touchmove', function (e) {
                if (!touchStartY) return;
                
                const touchY = e.touches[0].clientY;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
                const scrollableElement = document.scrollingElement || document.documentElement;
                const isAtTop = scrollTop <= 0;
                const isPullingDown = touchY > touchStartY;
                
                // Si on est en haut de la page et qu'on tire vers le bas, empêcher
                if (isAtTop && isPullingDown && !isScrolling) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                
                // Détecter si l'utilisateur scroll vraiment
                if (Math.abs(touchY - touchStartY) > 10) {
                    isScrolling = true;
                }
            }, { passive: false });
            
            document.addEventListener('touchend', function () {
                touchStartY = 0;
                isScrolling = false;
            }, { passive: true });
            
            // Empêcher le refresh avec F5 ou Ctrl+R
            document.addEventListener('keydown', function (e) {
                if ((e.key === 'F5') || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.key === 'R')) {
                    e.preventDefault();
                    return false;
                }
            });
            
            window.addEventListener('orientationchange', function() {
                setTimeout(() => {
                    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
                }, 300);
            });
         }
(function() {
            'use strict';
            
            // Fonction pour afficher l'écran d'erreur
            function showOfflineScreen() {
                // Vérifier si l'overlay existe déjà
                if (document.getElementById('offline-overlay')) {
                    return;
                }
                
                // Cacher tout le contenu de l'app
                const app = document.getElementById('app');
                if (app) {
                    app.style.display = 'none';
                }
                
                // Créer l'overlay
                const overlay = document.createElement('div');
                overlay.id = 'offline-overlay';
                overlay.innerHTML = `
                    <div style="
                        position: fixed; inset: 0; z-index: 99999;
                        background-color: #f8fafc; display: flex;
                        align-items: center; justify-content: center;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        text-align: center; padding: 2rem;
                    ">
                        <div style="max-width: 400px;">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" 
                                 stroke="#6b7280" stroke-width="2" stroke-linecap="round" 
                                 stroke-linejoin="round" style="margin: 0 auto 1.5rem auto; display: block;">
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.94M1 10.7l2.16 1.86a2.3 2.3 0 0 1 2.97 0L10 16.25"></path>
                                <path d="M8 12.25l.89-.78a2.3 2.3 0 0 1 2.97 0l4.24 3.68"></path>
                                <path d="M4.26 10.13a10.94 10.94 0 0 0-1.26 2.81"></path>
                                <path d="M10.7 4.69A10.94 10.94 0 0 1 12.94 4"></path>
                                <path d="M16 18l1.11.96a2.3 2.3 0 0 0 2.97 0l1.86-1.6"></path>
                                <path d="M22 10.7c0 .16-.01.32-.03.48"></path>
                                <path d="M2 12.94a10.94 10.94 0 0 1 5-2.81"></path>
                                <path d="M21 15l-1-1"></path>
                                <path d="M3 3l1 1"></path>
                                <path d="M12.94 22a10.94 10.94 0 0 1-2.81-.26"></path>
                            </svg>
                            <h1 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">
                                Pas de Connexion
                            </h1>
                            <p style="font-size: 1rem; color: #6b7280; margin-bottom: 1.5rem;">
                                Cette application nécessite une connexion internet pour fonctionner. 
                                Veuillez vérifier votre réseau.
                            </p>
                            <button onclick="window.location.reload()" style="
                                background-color: #2563eb; color: white; border: none;
                                padding: 0.75rem 1.5rem; border-radius: 0.75rem;
                                font-size: 1rem; font-weight: 500; cursor: pointer;
                                -webkit-tap-highlight-color: transparent;
                            " onmouseover="this.style.backgroundColor='#1d4ed8'" 
                               onmouseout="this.style.backgroundColor='#2563eb'">
                                Réessayer
                            </button>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);
            }
            
            // Fonction pour masquer l'écran d'erreur
            function hideOfflineScreen() {
                const overlay = document.getElementById('offline-overlay');
                if (overlay) {
                    overlay.remove();
                }
                
                // Réafficher l'app
                const app = document.getElementById('app');
                if (app) {
                    app.style.display = '';
                }
            }
            
            // Configuration des écouteurs d'événements
            function setupConnectionListeners() {
                let offlineTimeout;
                
                window.addEventListener('offline', () => {
                    offlineTimeout = setTimeout(() => {
                        if (!navigator.onLine) {
                            showOfflineScreen();
                        }
                    }, 1000);
                });
                
                window.addEventListener('online', () => {
                    if (offlineTimeout) {
                        clearTimeout(offlineTimeout);
                    }
                    
                    setTimeout(() => {
                        if (navigator.onLine) {
                            hideOfflineScreen();
                        }
                    }, 500);
                });
            }
            
            // Si l'overlay existe déjà (créé par le script précédent), on configure juste les événements
            if (document.getElementById('offline-overlay')) {
                // L'écran d'erreur est déjà affiché, on gère juste les événements
                setupConnectionListeners();
                return;
            }
            
            // Vérification au chargement du DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    if (!navigator.onLine) {
                        showOfflineScreen();
                    }
                    setupConnectionListeners();
                });
            } else {
                if (!navigator.onLine) {
                    showOfflineScreen();
                }
                setupConnectionListeners();
            }
        })();








// Capacitor Integration
        if (typeof Capacitor !== 'undefined') {
            console.log('🚀 Capacitor est prêt à être utilisé');
            
            window.addEventListener('resize', () => {
                document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
            });
        }

        // Déclaration des variables globales
        let supabase;
        let currentUser = null;
        let authListener = null; 
        let currentPage = 'dashboard';
        let currentStudentId = null;
        let currentAssignments = { studentIds: new Set(), subjectIds: new Set(), classIds: new Set() };
        // NOUVEAU: Variable pour suivre la classe sélectionnée dans l'onglet Matières et Notes
        let currentClassId = null;
        // MULTI-TENANT: contexte membre et effective owner id
let currentMemberContext = null; // si connecté en tant que member => { id, owner_user_id, auth_user_id, email, role }
let effectiveUserId = null; // utiliser pour toutes les requêtes: owner id si member, sinon currentUser.id
// NOUVEAU: Variable pour garder TOUS les élèves de l'école (avant filtrage) pour le calcul du vrai rang
let allSchoolStudents = []; // Tous les élèves de l'école, sans filtre de membre
// Variable pour stocker le membre à supprimer (pour la modale de confirmation)
let pendingDeleteMemberId = null;
// Variables pour stocker le message à supprimer (pour la modale de confirmation)
let pendingDeleteMessageId = null;
let pendingDeleteMessageStudentId = null;
// ...existing code...
        
        let appData = {
            students: [],
            studentsTotalCount: 0, // NOUVEAU: Compteur total d'élèves (pour pagination)
            classes: [],
            attendance: [],
            attendanceTotalCount: 0, // NOUVEAU: Compteur total de présences (pour pagination)
            absenceJustifications: [], // NOUVEAU: Justifications d'absence
            notifications: [],
            subjects: [], 
            grades: [],
            members: [], // NOUVEAU: comptes/members gérés localement (email, role, id, created_at)
            settings: {
                appName: "Perfect School",
                theme: "light",
                alertThreshold: 5,
                // NOUVEAUX PARAMÈTRES AJOUTÉS
                feries: [], // Jours fériés
                attendanceTimes: { // Heures de présence configurables
                    presentUntil: "07:59",
                    lateUntil: "15:00", 
                    autoAbsentAfter: "15:00"
                }
            },
            schoolSettings: {
                school_name: "Perfect School",
                // logo_url: "" (SUPPRIMÉ)
            }
        };

        // Variables pour le scanner
        let scanner = null;
        let qrScanner = null;

        // NOUVELLE VARIABLE : Date sélectionnée pour le tableau de bord
        let currentDashboardDate = new Date().toISOString().split('T')[0];

        // Initialisation Lucide Icons (protection si la librairie n'est pas chargée)
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }

        // ====================================================================
        // NOUVELLE FONCTIONNALITÉ : ONGLET MATIÈRES ET NOTES
        // ====================================================================

        function loadSubjectsPage() {
            // Si une classe est sélectionnée, afficher ses élèves avec les boutons matières/notes
            if (currentClassId) {
                loadClassStudents(currentClassId);
            } else {
                // Sinon afficher la liste des classes
                loadClassesList();
            }
        }

        // Fonction pour obtenir l'ordre sauvegardé des classes par niveau
        function getClassOrder(level) {
            const key = `class_order_${level}_${effectiveUserId || 'default'}`;
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        }

        // Fonction pour sauvegarder l'ordre des classes par niveau
        function saveClassOrder(level, classIds) {
            const key = `class_order_${level}_${effectiveUserId || 'default'}`;
            localStorage.setItem(key, JSON.stringify(classIds));
        }

        // Fonction pour organiser les classes par niveau avec ordre personnalisé
        function organizeClassesByLevel() {
            const levels = ['Primaire', 'Collège', 'Lycée'];
            const organized = {};
            
            levels.forEach(level => {
                const classesInLevel = appData.classes.filter(c => c.level === level);
                if (classesInLevel.length > 0) {
                    const savedOrder = getClassOrder(level);
                    if (savedOrder) {
                        // Réorganiser selon l'ordre sauvegardé
                        const ordered = [];
                        savedOrder.forEach(id => {
                            const found = classesInLevel.find(c => c.id === id);
                            if (found) ordered.push(found);
                        });
                        // Ajouter les nouvelles classes non sauvegardées
                        classesInLevel.forEach(c => {
                            if (!savedOrder.includes(c.id)) ordered.push(c);
                        });
                        organized[level] = ordered;
                    } else {
                        organized[level] = classesInLevel;
                    }
                }
            });
            
            return organized;
        }

        // Fonction pour réorganiser une classe (monter ou descendre)
        function reorderClass(classId, direction, level) {
            const organized = organizeClassesByLevel();
            const classes = organized[level] || [];
            const currentIndex = classes.findIndex(c => c.id === classId);
            
            if (currentIndex === -1) return;
            
            if (direction === 'up' && currentIndex > 0) {
                [classes[currentIndex], classes[currentIndex - 1]] = [classes[currentIndex - 1], classes[currentIndex]];
            } else if (direction === 'down' && currentIndex < classes.length - 1) {
                [classes[currentIndex], classes[currentIndex + 1]] = [classes[currentIndex + 1], classes[currentIndex]];
            }
            
            const classIds = classes.map(c => c.id);
            saveClassOrder(level, classIds);
            
            // Recharger la page actuelle
            if (currentPage === 'subjects') {
                loadClassesList();
            } else if (currentPage === 'students') {
                loadStudentsPage();
            }
        }

        function loadClassesList() {
            const organized = organizeClassesByLevel();
            const levels = ['Primaire', 'Collège', 'Lycée'];
            const hasClasses = Object.keys(organized).length > 0;
            
            document.getElementById('page-content').innerHTML = `
                <div class="space-y-6 fade-in">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Matières et Notes</h1>
                            <p class="text-gray-600">
                                Gérez les classes et consultez les élèves
                            </p>
                        </div>
                    </div>

                    ${hasClasses ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${levels.map(level => {
                                const classes = organized[level];
                                if (!classes || classes.length === 0) return '';
                                
                                return `
                                    <div class="space-y-3">
                                        <div class="flex items-center justify-between mb-3">
                                            <h2 class="text-lg font-bold text-gray-800">${level}</h2>
                                            <span class="text-sm text-gray-500">${classes.length} classe${classes.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div class="space-y-3">
                                            ${classes.map((classItem, index) => {
                                                const students = appData.students.filter(s => s.class_id === classItem.id);
                                                const isFirst = index === 0;
                                                const isLast = index === classes.length - 1;
                                                
                                                return `
                                                    <div class="card theme-transition relative group">
                                                        <div class="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                            ${!isFirst ? `
                                                                <button onclick="event.stopPropagation(); reorderClass('${classItem.id}', 'up', '${level}')" 
                                                                        class="btn btn-ghost btn-sm p-1 h-6 w-6" title="Monter">
                                                                    <i data-lucide="chevron-up" class="h-3 w-3"></i>
                                                                </button>
                                                            ` : ''}
                                                            ${!isLast ? `
                                                                <button onclick="event.stopPropagation(); reorderClass('${classItem.id}', 'down', '${level}')" 
                                                                        class="btn btn-ghost btn-sm p-1 h-6 w-6" title="Descendre">
                                                                    <i data-lucide="chevron-down" class="h-3 w-3"></i>
                                                                </button>
                                                            ` : ''}
                                                        </div>
                                                        <div class="cursor-pointer" onclick="selectClass('${classItem.id}')">
                                                            <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
                                                                <h3 class="text-xl font-bold">${classItem.name}</h3>
                                                            </div>
                                                            <div class="card-content">
                                                                <div class="flex items-center space-x-2 text-gray-600 mb-4">
                                                                    <i data-lucide="users" class="h-4 w-4"></i>
                                                                    <span>${students.length} élève${students.length !== 1 ? 's' : ''}</span>
                                                                </div>
                                                                <div class="space-y-2">
                                                                    ${students.slice(0, 3).map(student => `
                                                                        <div class="flex items-center space-x-2 p-2 border rounded-lg">
                                                                            <img src="${getSafePhotoUrl(student.photo)}" alt="${student.first_name}" class="w-8 h-8 rounded-full object-cover" onerror="this.style.display='none'">
                                                                            <span class="text-sm font-medium">${student.first_name} ${student.last_name}</span>
                                                                        </div>
                                                                    `).join('')}
                                                                    ${students.length > 3 ? `
                                                                        <div class="text-center text-sm text-gray-600">
                                                                            + ${students.length - 3} autre${students.length - 3 !== 1 ? 's' : ''} élève${students.length - 3 !== 1 ? 's' : ''}
                                                                        </div>
                                                                    ` : ''}
                                                                    ${students.length === 0 ? `
                                                                        <div class="text-center text-sm text-gray-500 py-2">
                                                                            Aucun élève dans cette classe
                                                                        </div>
                                                                    ` : ''}
                                                                </div>
                                                                <div class="mt-4 pt-4 border-t border-gray-200">
                                                                    <button onclick="event.stopPropagation(); selectClass('${classItem.id}')" class="btn btn-outline w-full btn-sm">
                                                                        <i data-lucide="users" class="h-4 w-4 mr-2"></i>
                                                                        Voir tous les élèves
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-12">
                            <i data-lucide="school" class="h-16 w-16 text-gray-400 mx-auto mb-4"></i>
                            <h3 class="text-lg font-semibold mb-2">Aucune classe créée</h3>
                            <p class="text-gray-600 mb-4">Commencez par créer une classe pour gérer les élèves</p>
                            <button onclick="showModal('add-class-modal')" class="btn btn-default">
                                <i data-lucide="plus" class="h-4 w-4 mr-2"></i>
                                Créer une classe
                            </button>
                        </div>
                    `}
                </div>
            `;
            
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }

        // Écrit par mohamed
        function selectClass(classId) {
            currentClassId = classId;
            loadClassStudents(classId);
        }

        function loadClassStudents(classId) {
            const classItem = appData.classes.find(c => c.id === classId);
            const students = appData.students.filter(s => s.class_id === classId);
            const classSubjects = appData.subjects.filter(s => s.class_id === classId);
            
            document.getElementById('page-content').innerHTML = `
                <div class="space-y-6 fade-in">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div class="flex items-center space-x-4">
                            <button onclick="backToClasses()" class="btn btn-ghost btn-icon">
                                <i data-lucide="arrow-left" class="h-4 w-4"></i>
                            </button>
                            <div>
                                <h1 class="text-3xl font-bold text-gray-900">${classItem?.name || 'Classe'}</h1>
                                <p class="text-gray-600">
                                    Liste des élèves - ${students.length} élève${students.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                            <!-- NOUVEAU : Bouton Ajouter une matière -->
                            <button onclick="showAddSubjectModal('${classId}')" class="btn btn-outline theme-transition">
                                <i data-lucide="book-open" class="h-4 w-4 mr-2"></i>
                                Ajouter une matière
                            </button>
                            <!-- NOUVEAU : Bouton Ajouter une note -->
                            <button onclick="showAddGradeModal('${classId}')" class="btn btn-default theme-transition">
                                <i data-lucide="pen-tool" class="h-4 w-4 mr-2"></i>
                                Ajouter une note
                            </button>
                        </div>
                    </div>

                    <!-- NOUVEAU : Liste des matières de la classe -->
                    ${classSubjects.length > 0 ? `
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-bold">Matières de la classe</h2>
                            </div>
                            <div class="card-content">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    ${classSubjects.map(subject => `
                                        <div class="p-3 border rounded-lg bg-blue-50 relative group cursor-pointer" onclick="loadSubjectGradesView('${subject.id}')">
                                            <div class="flex justify-between items-start">
                                                <div class="flex-1">
                                                    <h3 class="font-semibold">${subject.name}</h3>
                                                    <p class="text-sm text-blue-700">Note sur ${subject.max_score}</p>
                                                </div>
                                                <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                                                    <button onclick="event.stopPropagation(); showEditSubjectModal('${subject.id}')" class="btn btn-ghost btn-sm text-blue-600" title="Modifier">
                                                        <i data-lucide="edit" class="h-3 w-3"></i>
                                                    </button>
                                                    <button onclick="event.stopPropagation(); confirmDeleteSubject('${subject.id}')" class="btn btn-ghost btn-sm text-red-600" title="Supprimer">
                                                        <i data-lucide="trash-2" class="h-3 w-3"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="mt-2 text-sm text-blue-800 font-medium flex items-center">
                                                <i data-lucide="bar-chart-3" class="h-4 w-4 mr-1"></i>
                                                Voir le tableau des notes
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="card">
                        <div class="card-content">
                            <!-- NOTE: Pas de pagination ajoutée pour maintenir la stabilité. Le scroll natif est favorisé sur mobile. -->
                            <div class="space-y-4">
                                ${students.length > 0 ? students.map(student => {
                                    const studentGrades = appData.grades.filter(g => g.student_id === student.id);
                                    
                                    return `
                                        <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onclick="showStudentProfile('${student.id}')">
                                            <div class="flex items-center space-x-4">
                                                <img src="${getSafePhotoUrl(student.photo)}" alt="${student.first_name}" class="w-12 h-12 rounded-full object-cover" onerror="this.style.display='none'">
                                                <div>
                                                    <h3 class="font-semibold text-lg">${student.first_name} ${student.last_name}</h3>
                                                    <div class="flex flex-wrap gap-2 mt-1">
                                                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                                            <i data-lucide="calendar" class="h-3 w-3 mr-1"></i>
                                                            Né le ${new Date(student.birth_date).toLocaleDateString('fr-FR')}
                                                        </span>
                                                        ${studentGrades.length > 0 ? `
                                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                                <i data-lucide="star" class="h-3 w-3 mr-1"></i>
                                                                ${studentGrades.length} note${studentGrades.length !== 1 ? 's' : ''}
                                                            </span>
                                                        ` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <button onclick="event.stopPropagation(); showStudentGrades('${student.id}')" class="btn btn-ghost btn-sm" title="Voir les notes">
                                                    <i data-lucide="star" class="h-4 w-4"></i>
                                                </button>
                                                <button onclick="event.stopPropagation(); showStudentProfile('${student.id}')" class="btn btn-ghost btn-sm" title="Voir le profil">
                                                    <i data-lucide="eye" class="h-4 w-4"></i>
                                                </button>
                                                ${!currentMemberContext ? `
                                                    <button onclick="event.stopPropagation(); showEditStudentModal('${student.id}')" class="btn btn-ghost btn-sm" title="Modifier">
                                                        <i data-lucide="edit" class="h-4 w-4"></i>
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </div>
                                    `;
                                }).join('') : `
                                    <div class="text-center py-8">
                                        <i data-lucide="users" class="h-16 w-16 text-gray-400 mx-auto mb-4"></i>
                                        <h3 class="text-lg font-semibold mb-2">Aucun élève dans cette classe</h3>
                                        <p class="text-gray-600 mb-4">Ajoutez des élèves à cette classe pour les voir apparaître ici</p>
                                        <button onclick="showModal('add-student-modal')" class="btn btn-default">
                                            <i data-lucide="plus" class="h-4 w-4 mr-2"></i>
                                            Ajouter un élève
                                        </button>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>

                    ${students.length > 0 ? `
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="card bg-blue-50 border-blue-200">
                                <div class="card-content text-center">
                                    <div class="text-2xl font-bold text-blue-800">${students.length}</div>
                                    <p class="text-blue-700">Élèves total</p>
                                </div>
                            </div>
                            <div class="card bg-green-50 border-green-200">
                                <div class="card-content text-center">
                                    <div class="text-2xl font-bold text-green-800">${classSubjects.length}</div>
                                    <p class="text-green-700">Matières</p>
                                </div>
                            </div>
                            <div class="card bg-purple-50 border-purple-200">
                                <div class="card-content text-center">
                                    <div class="text-2xl font-bold text-purple-800">${appData.grades.filter(g => students.some(s => s.id === g.student_id)).length}</div>
                                    <p class="text-purple-700">Notes total</p>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }

        function backToClasses() {
            currentClassId = null;
            loadClassesList();
        }
        
        // ====================================================================
        // FONCTIONS POUR LA GESTION DES MATIÈRES ET NOTES (AMÉLIORÉ)
        // ====================================================================

        async function loadSubjectsFromSupabase() {
            try {
                if (!effectiveUserId) return;
                if (!currentUser) return;

                const { data, error } = await supabase
                    .from('subjects')
                    .select('*')
                    .eq('user_id', effectiveUserId);

                if (error) {
                    console.error('Erreur chargement matières:', error);
                    appData.subjects = [];
                } else {
                    appData.subjects = data || [];
                }
            } catch (error) {
                console.error('Erreur chargement matières:', error);
                appData.subjects = [];
            }
        }

        async function loadGradesFromSupabase() {
            try {
                if (!effectiveUserId) return;
                if (!currentUser) return;

                const { data, error } = await supabase
                    .from('grades')
                    .select('*')
                    .eq('user_id', effectiveUserId);

                if (error) {
                    console.error('Erreur chargement notes:', error);
                    appData.grades = [];
                } else {
                    appData.grades = data || [];
                }
            } catch (error) {
                console.error('Erreur chargement notes:', error);
                appData.grades = [];
            }
        }

        function showAddSubjectModal(classId) {
            document.getElementById('add-subject-class-id').value = classId;
            showModal('add-subject-modal');
        }

        function showEditSubjectModal(subjectId) {
            const subject = appData.subjects.find(s => s.id === subjectId);
            if (!subject) return;

            document.getElementById('edit-subject-id').value = subject.id;
            document.getElementById('edit-subject-class-id').value = subject.class_id;
            document.getElementById('edit-subject-name').value = subject.name;
            document.getElementById('grade-max-score').value = subject.max_score;

            showModal('edit-subject-modal');
        }

        function showAddGradeModal(classId) {
    document.getElementById('add-grade-class-id').value = classId;
    
    // Remplir la liste des élèves (cette partie ne change pas)
    const studentSelect = document.getElementById('grade-student-select');
    const students = appData.students.filter(s => s.class_id === classId);
    studentSelect.innerHTML = '<option value="">Sélectionner un élève</option>' +
        students.map(s => `<option value="${s.id}">${s.first_name} ${s.last_name}</option>`).join('');
    
    // --- C'EST ICI QU'EST LA LOGIQUE IMPORTANTE ---
    const subjectSelect = document.getElementById('grade-subject-select');
    // On récupère toutes les matières de la classe comme d'habitude
    let subjects = appData.subjects.filter(s => s.class_id === classId);

    // PUIS, on ajoute une condition :
    // Si l'utilisateur est un professeur, on filtre cette liste pour ne garder que ses matières assignées
    if (currentMemberContext && currentMemberContext.role === 'professeur') {
        // On récupère les IDs des matières assignées au prof
        const assignedSubjectIds = new Set(currentMemberContext.assigned_subject_ids || []);
        // On ne garde que les matières dont l'ID est dans la liste des matières assignées
        subjects = subjects.filter(s => assignedSubjectIds.has(s.id));
        
        console.log(`Professeur détecté. Affichage de ${subjects.length} matière(s) assignée(s).`);
    }

    // On remplit le menu déroulant avec la liste finale (filtrée ou non)
    subjectSelect.innerHTML = '<option value="">Sélectionner une matière</option>' +
        subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    // --- FIN DE LA PARTIE MODIFIÉE ---
    
    showModal('add-grade-modal');
}

        /**
         * Vérifie si un professeur peut modifier une note donnée
         * @param {string} gradeId - L'ID de la note à vérifier
         * @returns {boolean} - true si le professeur peut modifier, false sinon
         */
        function canProfessorEditGrade(gradeId) {
            // Si ce n'est pas un professeur (propriétaire ou autre), autoriser
            if (!currentMemberContext || currentMemberContext.role !== 'proffesseur') {
                return true;
            }

            // Trouver la note
            const grade = appData.grades.find(g => g.id === gradeId);
            if (!grade) return false;

            // Trouver la matière
            const subject = appData.subjects.find(s => s.id === grade.subject_id);
            if (!subject) return false;

            // Vérifier si la matière est assignée au professeur
            const assignedSubjectIds = new Set(currentMemberContext.assigned_subject_ids || []);
            return assignedSubjectIds.has(subject.id);
        }

        function showEditGradeModal(gradeId) {
            const grade = appData.grades.find(g => g.id === gradeId);
            if (!grade) return;

            // VÉRIFICATION DE SÉCURITÉ : Empêcher un professeur de modifier une note qui ne lui appartient pas
            if (!canProfessorEditGrade(gradeId)) {
                notificationManager.show('❌ Vous ne pouvez pas modifier une note d\'une matière qui ne vous est pas assignée.', 'error');
                return;
            }

            const student = appData.students.find(s => s.id === grade.student_id);
            const subject = appData.subjects.find(s => s.id === grade.subject_id);

            document.getElementById('edit-grade-id').value = grade.id;
            document.getElementById('edit-grade-student-name').textContent = student ? `${student.first_name} ${student.last_name}` : 'Élève inconnu';
            document.getElementById('edit-grade-subject-name').textContent = subject ? subject.name : 'Matière inconnue';
            document.getElementById('edit-grade-score').value = grade.score;
            document.getElementById('edit-grade-comment').value = grade.comment || '';

            showModal('edit-grade-modal');
        }

        function showStudentGrades(studentId) {
            const student = appData.students.find(s => s.id === studentId);
            if (!student) return;

            const studentGrades = appData.grades.filter(g => g.student_id === studentId);
            
            document.getElementById('student-grades-title').textContent = `Notes de ${student.first_name} ${student.last_name}`;
            
            document.getElementById('student-grades-content').innerHTML = `
                <div class="space-y-4">
                    ${studentGrades.length > 0 ? studentGrades.map(grade => {
                        const subject = appData.subjects.find(s => s.id === grade.subject_id);
                        const maxScore = subject ? subject.max_score : 20; // Récupérer le max_score de la matière
                        const percentage = (grade.score / maxScore * 100).toFixed(1);
                        
                        return `
                            <div class="border rounded-lg p-4">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <h3 class="font-semibold text-lg">${subject?.name || 'Matière inconnue'}</h3>
                                        <p class="text-gray-600 mt-1">${grade.comment || 'Aucun commentaire'}</p>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-2xl font-bold ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}">
                                            ${grade.score}/${maxScore}
                                        </div>
                                        <div class="text-sm ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}">
                                            ${percentage}%
                                        </div>
                                    </div>
                                </div>
                                <div class="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                                    ${(() => {
                                        // Vérifier si le professeur peut modifier cette note
                                        const canEdit = !currentMemberContext || currentMemberContext.role !== 'proffesseur' || 
                                            (() => {
                                                const assignedSubjectIds = new Set(currentMemberContext.assigned_subject_ids || []);
                                                return assignedSubjectIds.has(grade.subject_id);
                                            })();
                                        
                                        return canEdit ? `
                                            <button onclick="showEditGradeModal('${grade.id}')" class="btn btn-outline btn-sm flex-1">
                                                <i data-lucide="edit" class="h-3 w-3 mr-1"></i>
                                                Modifier
                                            </button>
                                            <button onclick="confirmDeleteGrade('${grade.id}')" class="btn btn-destructive btn-sm flex-1">
                                                <i data-lucide="trash-2" class="h-3 w-3 mr-1"></i>
                                                Supprimer
                                            </button>
                                        ` : '';
                                    })()}
                                </div>
                            </div>
                        `;
                    }).join('') : `
                        <div class="text-center py-8">
                            <i data-lucide="star" class="h-16 w-16 text-gray-400 mx-auto mb-4"></i>
                            <h3 class="text-lg font-semibold mb-2">Aucune note</h3>
                            <p class="text-gray-600">Cet élève n'a pas encore de notes</p>
                        </div>
                    `}
                </div>
            `;
            
            showModal('student-grades-modal');
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }

        /**
         * NOUVEAU: Affiche le tableau de notes pour une matière donnée.
         * Trie les notes de la meilleure à la moins bonne.
         */
        function loadSubjectGradesView(subjectId) {
            const subject = appData.subjects.find(s => s.id === subjectId);
            if (!subject) return;

            const allGradesForSubject = appData.grades.filter(g => g.subject_id === subjectId);
            
            // 1. Trier les notes par score, décroissant (meilleure note en haut)
            const sortedGrades = allGradesForSubject.map(grade => {
                const student = appData.students.find(s => s.id === grade.student_id);
                const scorePercentage = (grade.score / subject.max_score) * 100;
                return {
                    ...grade,
                    student,
                    scorePercentage
                };
            }).sort((a, b) => b.score - a.score);

            document.getElementById('subject-grades-title').textContent = `Notes de ${subject.name} (Max ${subject.max_score})`;
            
            document.getElementById('subject-grades-content').innerHTML = `
                <div class="space-y-4">
                    ${sortedGrades.length > 0 ? `
                        <div class="flex justify-between items-center mb-4">
                            <button onclick="exportSubjectGradesToPDF('${subject.id}')" class="btn btn-outline btn-sm">
                                <i data-lucide="file-text" class="h-4 w-4 mr-2"></i>
                                Exporter en PDF
                            </button>
                            <button onclick="showAddGradeModal('${subject.class_id}')" class="btn btn-default btn-sm">
                                <i data-lucide="pen-tool" class="h-4 w-4 mr-2"></i>
                                Ajouter une note pour cette classe
                            </button>
                        </div>
                        <div class="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
                            <table class="min-w-full divide-y divide-gray-200 border-collapse">
                                <thead class="bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0">
                             <tr>
                                <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500">Élève</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500">Évaluation</th>
                                <th class="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-blue-500">Note</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell border-r border-blue-500">Commentaire</th>
                                <th class="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Action</th>
                            </tr>
                             </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${sortedGrades.map((grade, index) => {
                                        const scoreColor = grade.scorePercentage >= 80 ? 'text-green-600' : grade.scorePercentage >= 50 ? 'text-yellow-600' : 'text-red-600';
                                        
                                        return `
<tr class="hover:bg-blue-50 transition-colors border-b border-gray-200">
    <td class="px-4 py-4 whitespace-nowrap border-r border-gray-200">
        <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 border-2 border-gray-300 rounded-full overflow-hidden">
                <img class="h-10 w-10 rounded-full object-cover" src="${getSafePhotoUrl(grade.student?.photo)}" alt="${grade.student?.first_name}" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4='">
            </div>
            <div class="ml-4">
                <div class="text-sm font-semibold text-gray-900">${grade.student?.first_name} ${grade.student?.last_name}</div>
                <div class="text-xs text-gray-500">${grade.student?.class_id ? appData.classes.find(c => c.id === grade.student.class_id)?.name : 'N/A'}</div>
            </div>
        </div>
    </td>
    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium border-r border-gray-200">
        ${grade.name || 'Note'}
    </td>
    <td class="px-4 py-4 whitespace-nowrap text-center border-r border-gray-200">
        <div class="text-lg font-bold ${scoreColor}">
            ${grade.score}/${subject.max_score}
        </div>
        <div class="text-xs ${scoreColor}">${grade.scorePercentage.toFixed(1)}%</div>
    </td>
    <td class="px-4 py-4 text-sm text-gray-500 hidden md:table-cell border-r border-gray-200">
        ${grade.comment || '—'}
    </td>
    <td class="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
        <div class="flex space-x-2 justify-center">
            ${(() => {
                // Vérifier si le professeur peut modifier cette note
                const canEdit = !currentMemberContext || currentMemberContext.role !== 'proffesseur' || 
                    (() => {
                        const assignedSubjectIds = new Set(currentMemberContext.assigned_subject_ids || []);
                        return assignedSubjectIds.has(grade.subject_id);
                    })();
                
                return canEdit ? `
                    <button onclick="showEditGradeModal('${grade.id}')" class="btn btn-ghost btn-sm text-blue-600" title="Modifier">
                        <i data-lucide="edit" class="h-4 w-4"></i>
                    </button>
                    <button onclick="confirmDeleteGrade('${grade.id}')" class="btn btn-ghost btn-sm text-red-600" title="Supprimer">
                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                    </button>
                ` : '';
            })()}
        </div>
    </td>
</tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <div class="text-center py-8">
                            <i data-lucide="star" class="h-16 w-16 text-gray-400 mx-auto mb-4"></i>
                            <h3 class="text-lg font-semibold mb-2">Aucune note</h3>
                            <p class="text-gray-600">Aucune note n'a encore été attribuée à cette matière.</p>
                            <button onclick="showAddGradeModal('${subject.class_id}')" class="btn btn-default mt-4">
                                <i data-lucide="pen-tool" class="h-4 w-4 mr-2"></i>
                                Ajouter la première note
                            </button>
                        </div>
                    `}
                </div>
            `;
            
            showModal('subject-grades-table-modal');
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }

        // Fonction pour exporter les notes d'une matière en PDF
        async function exportSubjectGradesToPDF(subjectId) {
            try {
                notificationManager.show('⏳ Préparation du PDF...', 'info');
                const subject = appData.subjects.find(s => s.id === subjectId);
                if (!subject) {
                    notificationManager.show('❌ Matière non trouvée', 'error');
                    return;
                }

                const classItem = appData.classes.find(c => c.id === subject.class_id);
                const allGradesForSubject = appData.grades.filter(g => g.subject_id === subjectId);
                
                // Trier les notes par score décroissant
                const sortedGrades = allGradesForSubject.map(grade => {
                    const student = appData.students.find(s => s.id === grade.student_id);
                    const scorePercentage = (grade.score / subject.max_score) * 100;
                    return {
                        ...grade,
                        student,
                        scorePercentage
                    };
                }).sort((a, b) => b.score - a.score);

                if (sortedGrades.length === 0) {
                    notificationManager.show('❌ Aucune note à exporter', 'warning');
                    return;
                }

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // En-tête professionnel
                doc.setFontSize(18).setTextColor(40, 40, 40);
                doc.setFont('helvetica', 'bold');
                doc.text('TABLEAU DES NOTES', 105, 20, { align: 'center' });
                
                doc.setFontSize(12).setTextColor(100, 100, 100);
                doc.setFont('helvetica', 'normal');
                doc.text(`${appData.schoolSettings.school_name}`, 105, 30, { align: 'center' });
                
                let y = 45;
                
                // Informations de la matière et classe
                doc.setFontSize(11).setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text('Matière:', 20, y);
                doc.setFont('helvetica', 'normal');
                doc.text(subject.name, 50, y);
                
                y += 7;
                if (classItem) {
                    doc.setFont('helvetica', 'bold');
                    doc.text('Classe:', 20, y);
                    doc.setFont('helvetica', 'normal');
                    doc.text(classItem.name, 50, y);
                    y += 7;
                }
                
                doc.setFont('helvetica', 'bold');
                doc.text('Note sur:', 20, y);
                doc.setFont('helvetica', 'normal');
                doc.text(`${subject.max_score}`, 50, y);
                
                y += 10;
                
                // Champ pour le nom du professeur et signature
                doc.setFontSize(10).setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text('Nom du professeur:', 20, y);
                doc.setFont('helvetica', 'normal');
                // Signature à droite
                doc.setFont('helvetica', 'bold');
                doc.text('Signature:', 120, y);
                doc.setFont('helvetica', 'normal');
                y += 10;
                
                // Tableau des notes avec autoTable
                const tableData = sortedGrades.map((grade, index) => {
                    const studentName = grade.student ? `${grade.student.first_name} ${grade.student.last_name}` : 'Élève inconnu';
                    const className = grade.student && grade.student.class_id 
                        ? (appData.classes.find(c => c.id === grade.student.class_id)?.name || 'N/A')
                        : 'N/A';
                    return [
                        (index + 1).toString(),
                        studentName,
                        className,
                        grade.name || 'Note',
                        `${grade.score}/${subject.max_score}`,
                        `${grade.scorePercentage.toFixed(1)}%`,
                        grade.comment || '—'
                    ];
                });

                doc.autoTable({
                    startY: y,
                    head: [['Rang', 'Élève', 'Classe', 'Évaluation', 'Note', 'Pourcentage', 'Commentaire']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: {
                        fillColor: [37, 99, 235],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        fontSize: 9,
                        halign: 'center',
                        lineColor: [255, 255, 255],
                        lineWidth: 0.1
                    },
                    bodyStyles: {
                        fontSize: 8,
                        textColor: [0, 0, 0],
                        lineColor: [200, 200, 200],
                        lineWidth: 0.1
                    },
                    alternateRowStyles: {
                        fillColor: [245, 247, 250]
                    },
                    columnStyles: {
                        0: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
                        1: { cellWidth: 38, halign: 'left' },
                        2: { cellWidth: 25, halign: 'left' },
                        3: { cellWidth: 30, halign: 'left' },
                        4: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
                        5: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
                        6: { cellWidth: 35, halign: 'left' }
                    },
                    margin: { left: 15, right: 15 },
                    styles: {
                        lineColor: [200, 200, 200],
                        lineWidth: 0.1
                    },
                    tableLineColor: [200, 200, 200],
                    tableLineWidth: 0.5
                });

                // Signature en bas
                const finalY = doc.lastAutoTable.finalY + 15;
                doc.setFontSize(10).setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text('Signature:', 20, finalY);
                doc.setFont('helvetica', 'normal');
                
                // Date de génération en bas à droite
                doc.setFontSize(8).setTextColor(150, 150, 150);
                doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, 105, finalY + 5, { align: 'center' });

                const pdfBlob = doc.output('blob');
                const filename = `Notes_${subject.name.replace(/[^a-zA-Z0-9]/g, '_')}_${classItem ? classItem.name.replace(/[^a-zA-Z0-9]/g, '_') : ''}.pdf`;
                await sharePDFMobile(pdfBlob, filename, `Notes - ${subject.name}`);
                
            } catch (error) {
                console.error('Erreur export notes matière:', error);
                notificationManager.show('❌ Erreur lors de l\'export.', 'error');
            }
        }
      
       // Fonction pour ajouter une note
        async function handleAddGrade(e) {
    e.preventDefault();
    if (!duplicateProtection.startGradeAdd()) return;
    const userIdToSave = effectiveUserId;
    if (!userIdToSave) {
        notificationManager.show('❌ Vous devez être connecté.', 'error');
        duplicateProtection.endGradeAdd();
        return;
    }

    try {
        const gradeData = {
            student_id: document.getElementById('grade-student-select').value,
            subject_id: document.getElementById('grade-subject-select').value,
            score: parseFloat(document.getElementById('grade-score').value),
            name: document.getElementById('grade-name').value.trim(),
            comment: document.getElementById('grade-comment').value,
            user_id: userIdToSave // <-- ON SAUVEGARDE AU NOM DU PROPRIÉTAIRE
        };

        const { data, error } = await supabase.from('grades').insert([gradeData]).select();
        if (error) throw error;
        
        appData.grades.push(data[0]);
        
        closeModal('add-grade-modal');
        document.getElementById('add-grade-form').reset();
        
        const subjectId = gradeData.subject_id;
        if (!document.getElementById('subject-grades-table-modal').classList.contains('hidden')) {
           loadSubjectGradesView(subjectId);
        } else {
           loadPage('subjects');
        }
        
        notificationManager.show('✅ Note ajoutée avec succès !', 'success');
    } catch (error) {
        console.error('Erreur ajout note:', error);
        notificationManager.show('❌ Erreur lors de l\'ajout de la note: ' + error.message, 'error');} 
            
    
            finally { 
                duplicateProtection.endGradeAdd();
            }
            
        } 

        async function handleEditGrade(e) {
            e.preventDefault();
            
            if (!currentUser) {
                notificationManager.show('❌ Vous devez être connecté pour modifier une note', 'error');
                return;
            }

            try {
                const gradeId = document.getElementById('edit-grade-id').value;
                
                // VÉRIFICATION DE SÉCURITÉ : Empêcher un professeur de modifier une note qui ne lui appartient pas
                if (!canProfessorEditGrade(gradeId)) {
                    notificationManager.show('❌ Vous ne pouvez pas modifier une note d\'une matière qui ne vous est pas assignée.', 'error');
                    closeModal('edit-grade-modal');
                    return;
                }

                const gradeData = {
                    score: parseFloat(document.getElementById('edit-grade-score').value),
                    comment: document.getElementById('edit-grade-comment').value
                };

                const { data, error } = await supabase
                    .from('grades')
                    .update(gradeData)
                    .eq('id', gradeId)
                    .eq('user_id', effectiveUserId)
                    .select();
                
                if (error) throw error;
                
                // Mettre à jour les données locales
                const gradeIndex = appData.grades.findIndex(g => g.id === gradeId);
                let subjectIdToReload = null;

                if (gradeIndex !== -1) {
                    subjectIdToReload = appData.grades[gradeIndex].subject_id;
                    appData.grades[gradeIndex] = { ...appData.grades[gradeIndex], ...data[0] };
                }
                
                closeModal('edit-grade-modal');
                
                // Re-render the student grades modal if it is open
                if (!document.getElementById('student-grades-modal').classList.contains('hidden')) {
                   const studentId = data[0].student_id;
                   showStudentGrades(studentId);
                } 
                // Re-render the subject grades table if it is open
                else if (!document.getElementById('subject-grades-table-modal').classList.contains('hidden')) {
                    loadSubjectGradesView(subjectIdToReload);
                }
                else {
                   loadPage('subjects');
                }
                notificationManager.show('✅ Note modifiée avec succès !', 'success');
            } catch (error) {
                console.error('Erreur modification note:', error);
                notificationManager.show('❌ Erreur lors de la modification de la note: ' + error.message, 'error');
            }
        }

        async function confirmDeleteSubject(subjectId) {
            if (!confirm('Êtes-vous sûr de vouloir supprimer cette matière ? Toutes les notes associées seront également supprimées.')) {
                return;
            }

            try {
                // Supprimer d'abord les notes associées
                const { error: gradesError } = await supabase
                    .from('grades')
                    .delete()
                    .eq('subject_id', subjectId)
                    .eq('user_id', effectiveUserId);
                
                if (gradesError) throw gradesError;

                // Puis supprimer la matière
                const { error: subjectError } = await supabase
                    .from('subjects')
                    .delete()
                    .eq('id', subjectId)
                    .eq('user_id', effectiveUserId);
                
                if (subjectError) throw subjectError;

                // Mettre à jour les données locales
                appData.subjects = appData.subjects.filter(s => s.id !== subjectId);
                appData.grades = appData.grades.filter(g => g.subject_id !== subjectId);

                loadPage('subjects');
                notificationManager.show('✅ Matière supprimée avec succès', 'success');
            } catch (error) {
                console.error('Erreur suppression matière:', error);
                notificationManager.show('❌ Erreur lors de la suppression: ' + error.message, 'error');
            }
        }

        async function confirmDeleteGrade(gradeId) {
            if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
                return;
            }

            // VÉRIFICATION DE SÉCURITÉ : Empêcher un professeur de supprimer une note qui ne lui appartient pas
            if (!canProfessorEditGrade(gradeId)) {
                notificationManager.show('❌ Vous ne pouvez pas supprimer une note d\'une matière qui ne vous est pas assignée.', 'error');
                return;
            }

            try {
                const gradeToDelete = appData.grades.find(g => g.id === gradeId);

                const { error } = await supabase
                    .from('grades')
                    .delete()
                    .eq('id', gradeId)
                    .eq('user_id', effectiveUserId);
                
                if (error) throw error;

                // Mettre à jour les données locales
                appData.grades = appData.grades.filter(g => g.id !== gradeId);

                // Re-render the student grades modal if it is open
                if (!document.getElementById('student-grades-modal').classList.contains('hidden')) {
                   showStudentGrades(gradeToDelete.student_id);
                }
                // Re-render the subject grades table if it is open
                else if (!document.getElementById('subject-grades-table-modal').classList.contains('hidden')) {
                    loadSubjectGradesView(gradeToDelete.subject_id);
                }
                notificationManager.show('✅ Note supprimée avec succès', 'success');
            } catch (error) {
                console.error('Erreur suppression note:', error);
                notificationManager.show('❌ Erreur lors de la suppression: ' + error.message, 'error');
            }
        }

        // ====================================================================
        // NOUVELLES FONCTIONNALITÉS : JOURS FÉRIÉS ET HEURES CONFIGURABLES
        // ====================================================================

        // NOUVEAU: Vérifier si une date est un jour férié
        function isFerie(date = new Date()) {
            const dateStr = date.toISOString().split('T')[0];
            return appData.settings.feries.includes(dateStr);
        }

        // NOUVEAU: Fonction améliorée pour déterminer le statut de présence
        // Écrit par mohamed
        function getAttendanceStatusByTimeWithConfig() {
            // Vérifier si c'est un jour férié
            // Écrit par khaled
            if (isFerie()) {
                return null; // Retourne null pour forcer la saisie manuelle
            }
            
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const totalMinutes = hours * 60 + minutes;

            // Utiliser les heures configurées
            // Écrit par mohamed
            const times = appData.settings.attendanceTimes;
            
            // Convertir les heures configurées en minutes
            // Écrit par khaled
            const presentUntil = convertTimeToMinutes(times.presentUntil);
            const lateUntil = convertTimeToMinutes(times.lateUntil);
            const autoAbsentAfter = convertTimeToMinutes(times.autoAbsentAfter);

            // Logique améliorée : présent jusqu'à l'heure configurée, puis en retard, puis absent
            // Écrit par mohamed
            if (totalMinutes >= 0 && totalMinutes <= presentUntil) {
                return 'present';
            } else if (totalMinutes > presentUntil && totalMinutes <= lateUntil) {
                return 'late';
            } else if (totalMinutes > lateUntil) {
                return 'absent';
            } else {
                return 'absent'; // Par défaut si hors des plages
            }
        }

        // NOUVEAU: Convertir le temps HH:MM en minutes
        function convertTimeToMinutes(timeStr) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        }

        // NOUVEAU: Formater les minutes en HH:MM
        function convertMinutesToTime(totalMinutes) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

        // NOUVEAU: Ajouter un jour férié
        function addFerie(dateStr) {
            if (!appData.settings.feries.includes(dateStr)) {
                appData.settings.feries.push(dateStr);
                appData.settings.feries.sort(); // Trier par date
                saveSettings();
                return true;
            }
            return false;
        }

        // NOUVEAU: Supprimer un jour férié
        function removeFerie(dateStr) {
            const index = appData.settings.feries.indexOf(dateStr);
            if (index > -1) {
                appData.settings.feries.splice(index, 1);
                saveSettings();
                loadPage('settings'); // Reload to update UI
                return true;
            }
            return false;
        }

        // NOUVEAU: Obtenir la liste des jours fériés formatés
        function getFormattedFeries() {
            return appData.settings.feries.map(dateStr => {
                const date = new Date(dateStr);
                 // Correction pour le fuseau horaire
                const userTimezoneOffset = date.getTimezoneOffset() * 60000;
                const correctedDate = new Date(date.getTime() + userTimezoneOffset);
                return {
                    date: dateStr,
                    formatted: correctedDate.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })
                };
            });
        }

        // ====================================================================
        // FONCTIONS POUR LA GESTION DES DATES - NOUVELLES FONCTIONNALITÉS
        // ====================================================================

        // NOUVEAU: Obtenir la date formatée pour l'affichage
        function getFormattedDate(dateString) {
            const date = new Date(dateString);
             // Correction pour le fuseau horaire
            const userTimezoneOffset = date.getTimezoneOffset() * 60000;
            const correctedDate = new Date(date.getTime() + userTimezoneOffset);
            return correctedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }

        // NOUVEAU: Obtenir la date d'hier
        function getYesterdayDate() {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday.toISOString().split('T')[0];
        }

        // NOUVEAU: Obtenir la date de demain
        function getTomorrowDate() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split('T')[0];
        }

        // NOUVEAU: Changer la date du tableau de bord
        function changeDashboardDate(newDate) {
            currentDashboardDate = newDate;
            loadPage('dashboard');
        }

        // NOUVEAU: Aller au jour précédent
        function previousDay() {
            const date = new Date(currentDashboardDate);
            date.setDate(date.getDate() - 1);
            changeDashboardDate(date.toISOString().split('T')[0]);
        }

        // NOUVEAU: Aller au jour suivant
        function nextDay() {
            const date = new Date(currentDashboardDate);
            date.setDate(date.getDate() + 1);
            changeDashboardDate(date.toISOString().split('T')[0]);
        }

        // NOUVEAU: Revenir à aujourd'hui
        function goToToday() {
            changeDashboardDate(new Date().toISOString().split('T')[0]);
        }

        // NOUVEAU: Filtrer les présences par date
        function getAttendanceForDate(date) {
            return appData.attendance.filter(a => a.date === date);
        }

        // ====================================================================
        // SYSTÈME DE NOTIFICATIONS AVEC HISTORIQUE - NOUVELLE FONCTIONNALITÉ
        // ====================================================================

        const notificationManager = {
            show(message, type = 'info', duration = 3000) {
                const notification = document.createElement('div');
                notification.className = `notification notification-${type}`;
                notification.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span>${message}</span>
                        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                            <i data-lucide="x" class="h-4 w-4"></i>
                        </button>
                    </div>
                `;
                
                document.body.appendChild(notification);
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }
                
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, duration);
            },

            // NOUVEAU: Ajouter une notification à l'historique
            addToHistory(notification) {
                const newNotification = {
                    id: Date.now().toString(),
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    timestamp: new Date().toISOString(),
                    read: false,
                    data: notification.data || {}
                };
                
                appData.notifications.unshift(newNotification);
                this.updateNotificationBadge();
                this.saveNotifications();
                
                return newNotification;
            },

            // NOUVEAU: Marquer une notification comme lue
            markAsRead(notificationId) {
                const notification = appData.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.read = true;
                    this.updateNotificationBadge();
                    this.saveNotifications();
                    this.renderNotificationsList();
                }
            },

            // NOUVEAU: Marquer toutes comme lues
            markAllAsRead() {
                appData.notifications.forEach(n => n.read = true);
                this.updateNotificationBadge();
                this.saveNotifications();
                this.renderNotificationsList();
            },

            // NOUVEAU: Effacer toutes les notifications
            clearAll() {
                appData.notifications = [];
                this.updateNotificationBadge();
                this.saveNotifications();
                this.renderNotificationsList();
            },

            // NOUVEAU: Mettre à jour le badge de notification
            updateNotificationBadge() {
                const badge = document.getElementById('notification-badge');
                const unreadCount = appData.notifications.filter(n => !n.read).length;
                
                if (badge) {
                    if (unreadCount > 0) {
                        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                        badge.classList.remove('hidden');
                    } else {
                        badge.classList.add('hidden');
                    }
                }
            },

            // NOUVEAU: Sauvegarder les notifications
            saveNotifications() {
                if (currentUser) {
                    // Limiter à 50 notifications pour ne pas surcharger localStorage
                    const notificationsToSave = appData.notifications.slice(0, 50);
                    localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(notificationsToSave));
                }
            },

            // NOUVEAU: Charger les notifications
            loadNotifications() {
                if (currentUser) {
                    const saved = localStorage.getItem(`notifications_${currentUser.id}`);
                    if (saved) {
                        appData.notifications = JSON.parse(saved);
                        this.updateNotificationBadge();
                    }
                }
            },

            // NOUVEAU: Afficher la liste des notifications
            renderNotificationsList() {
                const list = document.getElementById('notifications-list');
                if (!list) return;

                const notifications = appData.notifications.slice(0, 20); // Limiter à 20 dernières
                
                if (notifications.length === 0) {
                    list.innerHTML = `
                        <div class="p-4 text-center text-gray-500">
                            <i data-lucide="bell-off" class="h-8 w-8 mx-auto mb-2"></i>
                            <p>Aucune notification</p>
                        </div>
                    `;
                    if (window.lucide && typeof window.lucide.createIcons === 'function') {
                        window.lucide.createIcons();
                    }
                    return;
                }

                list.innerHTML = notifications.map(notification => `
                    <div class="notification-item ${notification.read ? '' : 'unread'}" onclick="notificationManager.markAsRead('${notification.id}')">
                        <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0 mt-1">
                                ${this.getNotificationIcon(notification.type)}
                            </div>
                            <div class="flex-1">
                                <h4 class="font-semibold text-sm">${notification.title}</h4>
                                <p class="text-sm text-gray-600">${notification.message}</p>
                                <div class="notification-time">
                                    ${this.formatTime(notification.timestamp)}
                                </div>
                            </div>
                            ${!notification.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>' : ''}
                        </div>
                    </div>
                `).join('');

                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }
            },

            // NOUVEAU: Obtenir l'icône selon le type
            getNotificationIcon(type) {
                const icons = {
                    'info': '<i data-lucide="info" class="h-4 w-4 text-blue-500"></i>',
                    'success': '<i data-lucide="check-circle" class="h-4 w-4 text-green-500"></i>',
                    'warning': '<i data-lucide="alert-triangle" class="h-4 w-4 text-yellow-500"></i>',
                    'error': '<i data-lucide="alert-circle" class="h-4 w-4 text-red-500"></i>',
                    'analysis': '<i data-lucide="bar-chart" class="h-4 w-4 text-purple-500"></i>'
                };
                return icons[type] || icons['info'];
            },

            // NOUVEAU: Formater l'heure
            formatTime(timestamp) {
                const date = new Date(timestamp);
                const now = new Date();
                const diffMs = now - date;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);

                if (diffMins < 1) return 'À l\'instant';
                if (diffMins < 60) return `Il y a ${diffMins} min`;
                if (diffHours < 24) return `Il y a ${diffHours} h`;
                if (diffDays < 7) return `Il y a ${diffDays} j`;
                
                return date.toLocaleDateString('fr-FR');
            },

            // NOUVEAU: Basculer l'affichage du menu déroulant
            toggleDropdown() {
                const dropdown = document.getElementById('notifications-dropdown');
                if (dropdown.classList.contains('hidden')) {
                    dropdown.classList.remove('hidden');
                    this.renderNotificationsList();
                } else {
                    dropdown.classList.add('hidden');
                }
            }
        };

        // ====================================================================
        // FONCTIONNALITÉ D'ANALYSE RAPIDE - NOUVELLE FONCTIONNALITÉ
        // ====================================================================

        // NOUVEAU: Générer une analyse rapide des présences
        function generateQuickAnalysis() {
            const today = new Date().toISOString().split('T')[0];
            const todayAttendance = getAttendanceForDate(today);
            
            // Statistiques globales
            const totalStudents = appData.students.length;
            const presentCount = todayAttendance.filter(a => a.status === 'present').length;
            const lateCount = todayAttendance.filter(a => a.status === 'late').length;
            const absentCount = todayAttendance.filter(a => a.status === 'absent').length;
            const sickCount = todayAttendance.filter(a => a.status === 'sick').length;
            const absentJustifiedCount = todayAttendance.filter(a => a.status === 'absent_justified').length;
            const markedCount = presentCount + lateCount + sickCount + absentCount + absentJustifiedCount;
            const unmarkedCount = totalStudents - markedCount;
            
            const presentRate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0;
            const markedRate = totalStudents > 0 ? ((markedCount / totalStudents) * 100).toFixed(1) : 0;

            // Analyse par classe
            let classAnalysis = '';
            appData.classes.forEach(classItem => {
                const classStudents = appData.students.filter(s => s.class_id === classItem.id);
                const classAttendance = todayAttendance.filter(a => 
                    classStudents.some(s => s.id === a.student_id)
                );
                const classPresent = classAttendance.filter(a => a.status === 'present').length;
                const classRate = classStudents.length > 0 ? ((classPresent / classStudents.length) * 100).toFixed(1) : 0;
                
                classAnalysis += `\n• ${classItem.name}: ${classRate}% (${classPresent}/${classStudents.length})`;
            });

            // Générer le message d'analyse
            let analysisMessage = `📊 ANALYSE RAPIDE - ${new Date().toLocaleDateString('fr-FR')}\n\n`;
            analysisMessage += `👥 ÉLÈVES TOTAUX: ${totalStudents}\n`;
            analysisMessage += `✅ PRÉSENTS: ${presentCount} (${presentRate}%)\n`;
            analysisMessage += `⏰ RETARDS: ${lateCount}\n`;
            analysisMessage += `🤒 MALADIES: ${sickCount}\n`;
            analysisMessage += `📋 ABSENCES JUSTIFIÉES: ${absentJustifiedCount}\n`;
            analysisMessage += `❌ ABSENTS NON JUSTIFIÉS: ${absentCount}\n`;
            analysisMessage += `📝 MARQUÉS: ${markedCount}/${totalStudents} (${markedRate}%)\n`;
            analysisMessage += `⏳ EN ATTENTE: ${unmarkedCount}\n\n`;
            analysisMessage += `📚 PAR CLASSE:${classAnalysis}\n\n`;

            // Recommandations
            if (absentCount > appData.settings.alertThreshold) {
                analysisMessage += `⚠️ ALERTE: ${absentCount} absents non justifiés dépassent le seuil de ${appData.settings.alertThreshold}\n`;
            }
            
            if (unmarkedCount > 0) {
                analysisMessage += `📋 ACTION: ${unmarkedCount} élèves à marquer\n`;
            }

            if (presentRate > 90) {
                analysisMessage += `🎉 EXCELLENT: Taux de présence exceptionnel!\n`;
            } else if (presentRate < 70) {
                analysisMessage += `💡 ATTENTION: Taux de présence faible\n`;
            }

            // Ajouter à l'historique des notifications
            notificationManager.addToHistory({
                type: 'analysis',
                title: 'Analyse rapide des présences',
                message: "Analyse générée, voir la console pour plus de détails.",
                data: {
                    presentCount,
                    lateCount,
                    absentCount,
                    sickCount,
                    absentJustifiedCount,
                    presentRate,
                    markedRate
                }
            });

            // Fermer le menu déroulant
            document.getElementById('notifications-dropdown').classList.add('hidden');

            // Afficher une notification popup
            notificationManager.show('📊 Analyse générée avec succès!', 'success');
            console.log(analysisMessage);
            alert(analysisMessage); // Also show in an alert for easy viewing

            return analysisMessage;
        }

        // ====================================================================
        // CENTRE DE RAPPORTS - NOUVELLE FONCTIONNALITÉ PROFESSIONNELLE
        // ====================================================================
        
        let currentReportData = null;
        let reportCharts = {
            presence: null,
            classes: null
        };
        
        // Fonction pour ouvrir le Centre de Rapports
        function showReportCenter() {
            // Nettoyer les anciens rapports
            currentReportData = null;
            document.getElementById('report-results').classList.add('hidden');
            document.getElementById('report-loading').classList.add('hidden');
            
            // Réinitialiser les onglets
            document.querySelectorAll('.report-tab-btn').forEach(btn => {
                btn.classList.remove('active', 'border-blue-600', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-gray-600');
            });
            document.querySelector('.report-tab-btn').classList.add('active', 'border-blue-600', 'text-blue-600');
            document.querySelectorAll('.report-tab-content').forEach(content => content.classList.add('hidden'));
            document.getElementById('report-tab-overview').classList.remove('hidden');
            
            // Détruire les anciens graphiques
            if (reportCharts.presence) reportCharts.presence.destroy();
            if (reportCharts.classes) reportCharts.classes.destroy();
            reportCharts.presence = null;
            reportCharts.classes = null;
            
            // Définir les dates par défaut (aujourd'hui)
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('report-date-start').value = today;
            document.getElementById('report-date-end').value = today;
            
            // Ouvrir le modal
            showModal('report-center-modal');
            
            // Initialiser les icônes
            setTimeout(() => {
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }
            }, 100);
        }
        
        // Fonction pour définir rapidement une période
        function setReportPeriod(period) {
            const today = new Date();
            const startInput = document.getElementById('report-date-start');
            const endInput = document.getElementById('report-date-end');
            
            let startDate, endDate;
            
            switch(period) {
                case 'today':
                    startDate = today;
                    endDate = today;
                    break;
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    startDate = yesterday;
                    endDate = yesterday;
                    break;
                case 'week':
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay());
                    startDate = weekStart;
                    endDate = today;
                    break;
                case 'month':
                    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                    startDate = monthStart;
                    endDate = today;
                    break;
                case 'lastMonth':
                    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
                    startDate = lastMonthStart;
                    endDate = lastMonthEnd;
                    break;
            }
            
            startInput.value = startDate.toISOString().split('T')[0];
            endInput.value = endDate.toISOString().split('T')[0];
        }
        
        // Fonction pour changer d'onglet
        function switchReportTab(tabName) {
            // Mettre à jour les boutons
            document.querySelectorAll('.report-tab-btn').forEach(btn => {
                btn.classList.remove('active', 'border-blue-600', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-gray-600');
            });
            
            // Trouver le bouton actif
            const activeBtn = document.querySelector(`[onclick="switchReportTab('${tabName}')"]`);
            if (activeBtn) {
                activeBtn.classList.add('active', 'border-blue-600', 'text-blue-600');
                activeBtn.classList.remove('border-transparent', 'text-gray-600');
            }
            
            // Mettre à jour le contenu
            document.querySelectorAll('.report-tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`report-tab-${tabName}`).classList.remove('hidden');
        }
        
        // Fonction principale pour générer le rapport
        async function runReport() {
            const startDate = document.getElementById('report-date-start').value;
            const endDate = document.getElementById('report-date-end').value;
            
            if (!startDate || !endDate) {
                notificationManager.show('Veuillez sélectionner une période', 'error');
                return;
            }
            
            if (new Date(startDate) > new Date(endDate)) {
                notificationManager.show('La date de début doit être antérieure à la date de fin', 'error');
                return;
            }
            
            // Afficher le chargement
            document.getElementById('report-loading').classList.remove('hidden');
            document.getElementById('report-results').classList.add('hidden');
            document.getElementById('generate-report-btn').disabled = true;
            
            try {
                // Filtrer les données de présence dans la période
                const periodAttendance = appData.attendance.filter(a => {
                    const date = a.date;
                    return date >= startDate && date <= endDate;
                });
                
                // Filtrer les notes dans la période (si date disponible dans grades)
                const periodGrades = appData.grades.filter(g => {
                    // Si les notes ont une date, filtrer par date
                    if (g.date) {
                        return g.date >= startDate && g.date <= endDate;
                    }
                    // Sinon, inclure toutes les notes
                    return true;
                });
                
                // Calculer les statistiques globales
                const totalStudents = appData.students.length;
                const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
                
                // Statistiques de présence
                const presentCount = periodAttendance.filter(a => a.status === 'present').length;
                const lateCount = periodAttendance.filter(a => a.status === 'late').length;
                const absentCount = periodAttendance.filter(a => a.status === 'absent').length;
                const sickCount = periodAttendance.filter(a => a.status === 'sick').length;
                const absentJustifiedCount = periodAttendance.filter(a => a.status === 'absent_justified').length;
                const totalMarked = presentCount + lateCount + absentCount + sickCount + absentJustifiedCount;
                
                const presentRate = totalMarked > 0 ? ((presentCount / totalMarked) * 100).toFixed(1) : 0;
                const absentRate = totalMarked > 0 ? ((absentCount / totalMarked) * 100).toFixed(1) : 0;
                const lateRate = totalMarked > 0 ? ((lateCount / totalMarked) * 100).toFixed(1) : 0;
                
                // Statistiques par classe
                const classStats = appData.classes.map(classItem => {
                    const classStudents = appData.students.filter(s => s.class_id === classItem.id);
                    const classAttendance = periodAttendance.filter(a => 
                        classStudents.some(s => s.id === a.student_id)
                    );
                    const classPresent = classAttendance.filter(a => a.status === 'present').length;
                    const classTotal = classAttendance.length;
                    const classPresentRate = classTotal > 0 ? ((classPresent / classTotal) * 100).toFixed(1) : 0;
                    
                    return {
                        id: classItem.id,
                        name: classItem.name,
                        studentsCount: classStudents.length,
                        presentCount: classPresent,
                        totalAttendance: classTotal,
                        presentRate: parseFloat(classPresentRate),
                        attendance: classAttendance
                    };
                });
                
                // Identifier les élèves à risque (absences + mauvaises notes)
                const riskStudents = [];
                appData.students.forEach(student => {
                    const studentAttendance = periodAttendance.filter(a => a.student_id === student.id);
                    const studentAbsences = studentAttendance.filter(a => 
                        a.status === 'absent' || a.status === 'absent_justified'
                    ).length;
                    
                    const studentGrades = periodGrades.filter(g => g.student_id === student.id);
                    const averageGrade = studentGrades.length > 0 
                        ? studentGrades.reduce((sum, g) => {
                            const subject = appData.subjects.find(s => s.id === g.subject_id);
                            const maxScore = subject ? subject.max_score : 20;
                            return sum + (g.score / maxScore * 100);
                        }, 0) / studentGrades.length
                        : null;
                    
                    // Critères d'élève à risque
                    const isAtRisk = (studentAbsences >= 3) || (averageGrade !== null && averageGrade < 50);
                    
                    if (isAtRisk) {
                        riskStudents.push({
                            student: student,
                            absences: studentAbsences,
                            averageGrade: averageGrade ? averageGrade.toFixed(1) : 'N/A',
                            grades: studentGrades.length,
                            reasons: []
                        });
                        
                        if (studentAbsences >= 3) {
                            riskStudents[riskStudents.length - 1].reasons.push(`Absences fréquentes (${studentAbsences})`);
                        }
                        if (averageGrade !== null && averageGrade < 50) {
                            riskStudents[riskStudents.length - 1].reasons.push(`Moyenne faible (${averageGrade.toFixed(1)}%)`);
                        }
                    }
                });
                
                // Stocker les données pour l'export
                currentReportData = {
                    startDate,
                    endDate,
                    totalStudents,
                    totalDays,
                    presentCount,
                    lateCount,
                    absentCount,
                    sickCount,
                    absentJustifiedCount,
                    totalMarked,
                    presentRate,
                    absentRate,
                    lateRate,
                    classStats,
                    riskStudents,
                    periodAttendance,
                    periodGrades
                };
                
                // Afficher les résultats
                displayReportResults();
                
            } catch (error) {
                console.error('Erreur génération rapport:', error);
                notificationManager.show('Erreur lors de la génération du rapport', 'error');
            } finally {
                document.getElementById('report-loading').classList.add('hidden');
                document.getElementById('report-results').classList.remove('hidden');
                document.getElementById('generate-report-btn').disabled = false;
            }
        }
        
        // Fonction pour afficher les résultats du rapport
        function displayReportResults() {
            if (!currentReportData) return;
            
            const data = currentReportData;
            
            // Afficher les statistiques globales
            const overviewStats = `
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="text-sm text-blue-600 font-medium">Présents</div>
                        <div class="text-2xl font-bold text-blue-900">${data.presentCount}</div>
                        <div class="text-xs text-blue-600">${data.presentRate}%</div>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <div class="text-sm text-yellow-600 font-medium">Retards</div>
                        <div class="text-2xl font-bold text-yellow-900">${data.lateCount}</div>
                        <div class="text-xs text-yellow-600">${data.lateRate}%</div>
                    </div>
                    <div class="bg-red-50 p-4 rounded-lg">
                        <div class="text-sm text-red-600 font-medium">Absents</div>
                        <div class="text-2xl font-bold text-red-900">${data.absentCount}</div>
                        <div class="text-xs text-red-600">${data.absentRate}%</div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <div class="text-sm text-green-600 font-medium">Élèves totaux</div>
                        <div class="text-2xl font-bold text-green-900">${data.totalStudents}</div>
                        <div class="text-xs text-green-600">${data.totalDays} jours</div>
                    </div>
                </div>
            `;
            document.getElementById('report-overview-stats').innerHTML = overviewStats;
            
            // Générer les graphiques
            generateReportCharts();
            
            // Afficher l'analyse par classe
            const classesHTML = data.classStats.map(stat => `
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="font-semibold">${stat.name}</h3>
                    </div>
                    <div class="card-content">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div class="text-sm text-gray-600">Élèves</div>
                                <div class="text-xl font-bold">${stat.studentsCount}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-600">Présents</div>
                                <div class="text-xl font-bold text-green-600">${stat.presentCount}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-600">Total marquages</div>
                                <div class="text-xl font-bold">${stat.totalAttendance}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-600">Taux présence</div>
                                <div class="text-xl font-bold text-blue-600">${stat.presentRate}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            document.getElementById('report-classes-content').innerHTML = classesHTML || '<p class="text-center text-gray-600">Aucune donnée disponible</p>';
            
            // Afficher les élèves à risque
            const risksHTML = data.riskStudents.length > 0 ? `
                <div class="space-y-4">
                    ${data.riskStudents.map(risk => `
                        <div class="card border-l-4 border-red-500">
                            <div class="card-content">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h3 class="font-semibold text-lg">${risk.student.last_name} ${risk.student.first_name}</h3>
                                        <p class="text-sm text-gray-600">${appData.classes.find(c => c.id === risk.student.class_id)?.name || 'Classe inconnue'}</p>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm text-gray-600">Absences</div>
                                        <div class="text-xl font-bold text-red-600">${risk.absences}</div>
                                    </div>
                                </div>
                                <div class="mt-4 pt-4 border-t">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-sm text-gray-600">Moyenne des notes:</span>
                                        <span class="font-bold ${risk.averageGrade !== 'N/A' && parseFloat(risk.averageGrade) < 50 ? 'text-red-600' : 'text-gray-900'}">${risk.averageGrade}%</span>
                                    </div>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        ${risk.reasons.map(reason => `<span class="badge badge-danger">${reason}</span>`).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="text-center text-gray-600 py-8">🎉 Aucun élève à risque identifié pour cette période !</p>';
            document.getElementById('report-risks-content').innerHTML = risksHTML;
            
            // Réinitialiser les icônes
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }
        
        // Fonction pour générer les graphiques
        function generateReportCharts() {
            if (!currentReportData) return;
            
            const data = currentReportData;
            
            // Graphique de répartition des présences (camembert)
            const presenceCtx = document.getElementById('report-chart-presence');
            if (presenceCtx) {
                if (reportCharts.presence) reportCharts.presence.destroy();
                
                reportCharts.presence = new Chart(presenceCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Présents', 'Retards', 'Absents', 'Malades', 'Absents justifiés'],
                        datasets: [{
                            data: [data.presentCount, data.lateCount, data.absentCount, data.sickCount, data.absentJustifiedCount],
                            backgroundColor: [
                                '#10b981',
                                '#f59e0b',
                                '#ef4444',
                                '#8b5cf6',
                                '#3b82f6'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }
            
            // Graphique de taux de présence par classe (barres)
            const classesCtx = document.getElementById('report-chart-classes');
            if (classesCtx && data.classStats.length > 0) {
                if (reportCharts.classes) reportCharts.classes.destroy();
                
                reportCharts.classes = new Chart(classesCtx, {
                    type: 'bar',
                    data: {
                        labels: data.classStats.map(s => s.name),
                        datasets: [{
                            label: 'Taux de présence (%)',
                            data: data.classStats.map(s => s.presentRate),
                            backgroundColor: '#3b82f6'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }
        }
        
        // Fonction pour exporter en PDF
        async function exportReportToPDF() {
            if (!currentReportData) {
                notificationManager.show('Veuillez d\'abord générer un rapport', 'error');
                return;
            }
            
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                const data = currentReportData;
                
                // Titre
                doc.setFontSize(18);
                doc.text('Centre de Rapports', 14, 20);
                
                // Informations de l'école
                const schoolName = appData.schoolSettings?.school_name || 'Perfect School';
                doc.setFontSize(12);
                doc.text(schoolName, 14, 30);
                doc.text(`Période: ${formatDate(data.startDate)} - ${formatDate(data.endDate)}`, 14, 36);
                doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 42);
                
                let yPos = 50;
                
                // Statistiques globales
                doc.setFontSize(14);
                doc.text('Statistiques Globales', 14, yPos);
                yPos += 10;
                
                doc.autoTable({
                    startY: yPos,
                    head: [['Statistique', 'Valeur', 'Pourcentage']],
                    body: [
                        ['Présents', data.presentCount.toString(), data.presentRate + '%'],
                        ['Retards', data.lateCount.toString(), data.lateRate + '%'],
                        ['Absents', data.absentCount.toString(), data.absentRate + '%'],
                        ['Malades', data.sickCount.toString(), '-'],
                        ['Absents justifiés', data.absentJustifiedCount.toString(), '-'],
                        ['Total marquages', data.totalMarked.toString(), '-'],
                        ['Élèves totaux', data.totalStudents.toString(), '-']
                    ],
                    theme: 'grid',
                    headStyles: { fillColor: [37, 99, 235] },
                    styles: { fontSize: 10 }
                });
                
                yPos = doc.lastAutoTable.finalY + 15;
                
                // Statistiques par classe
                doc.setFontSize(14);
                doc.text('Statistiques par Classe', 14, yPos);
                yPos += 10;
                
                const classTableData = data.classStats.map(stat => [
                    stat.name,
                    stat.studentsCount.toString(),
                    stat.presentCount.toString(),
                    stat.totalAttendance.toString(),
                    stat.presentRate + '%'
                ]);
                
                doc.autoTable({
                    startY: yPos,
                    head: [['Classe', 'Élèves', 'Présents', 'Total marquages', 'Taux présence']],
                    body: classTableData,
                    theme: 'grid',
                    headStyles: { fillColor: [37, 99, 235] },
                    styles: { fontSize: 9 }
                });
                
                yPos = doc.lastAutoTable.finalY + 15;
                
                // Élèves à risque
                if (data.riskStudents.length > 0) {
                    doc.setFontSize(14);
                    doc.text('Élèves à Risque', 14, yPos);
                    yPos += 10;
                    
                    const riskTableData = data.riskStudents.map(risk => [
                        `${risk.student.last_name} ${risk.student.first_name}`,
                        appData.classes.find(c => c.id === risk.student.class_id)?.name || 'N/A',
                        risk.absences.toString(),
                        risk.averageGrade + '%',
                        risk.reasons.join(', ')
                    ]);
                    
                    doc.autoTable({
                        startY: yPos,
                        head: [['Élève', 'Classe', 'Absences', 'Moyenne', 'Raisons']],
                        body: riskTableData,
                        theme: 'grid',
                        headStyles: { fillColor: [239, 68, 68] },
                        styles: { fontSize: 9 }
                    });
                }
                
                // Sauvegarder le PDF
                const fileName = `Rapport_${formatDate(data.startDate)}_${formatDate(data.endDate)}.pdf`;
                doc.save(fileName);
                
                notificationManager.show('PDF exporté avec succès!', 'success');
                
            } catch (error) {
                console.error('Erreur export PDF:', error);
                notificationManager.show('Erreur lors de l\'export PDF', 'error');
            }
        }
        
        // Fonction pour exporter en Excel (CSV)
        function exportReportToExcel() {
            if (!currentReportData) {
                notificationManager.show('Veuillez d\'abord générer un rapport', 'error');
                return;
            }
            
            try {
                const data = currentReportData;
                let csvContent = '';
                
                // En-tête
                csvContent += 'Centre de Rapports\n';
                csvContent += `École: ${appData.schoolSettings?.school_name || 'Perfect School'}\n`;
                csvContent += `Période: ${formatDate(data.startDate)} - ${formatDate(data.endDate)}\n`;
                csvContent += `Généré le: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
                
                // Statistiques globales
                csvContent += 'STATISTIQUES GLOBALES\n';
                csvContent += 'Statistique,Valeur,Pourcentage\n';
                csvContent += `Présents,${data.presentCount},${data.presentRate}%\n`;
                csvContent += `Retards,${data.lateCount},${data.lateRate}%\n`;
                csvContent += `Absents,${data.absentCount},${data.absentRate}%\n`;
                csvContent += `Malades,${data.sickCount},-\n`;
                csvContent += `Absents justifiés,${data.absentJustifiedCount},-\n`;
                csvContent += `Total marquages,${data.totalMarked},-\n`;
                csvContent += `Élèves totaux,${data.totalStudents},-\n\n`;
                
                // Statistiques par classe
                csvContent += 'STATISTIQUES PAR CLASSE\n';
                csvContent += 'Classe,Élèves,Présents,Total marquages,Taux présence\n';
                data.classStats.forEach(stat => {
                    csvContent += `${stat.name},${stat.studentsCount},${stat.presentCount},${stat.totalAttendance},${stat.presentRate}%\n`;
                });
                csvContent += '\n';
                
                // Élèves à risque
                if (data.riskStudents.length > 0) {
                    csvContent += 'ÉLÈVES À RISQUE\n';
                    csvContent += 'Nom,Prénom,Classe,Absences,Moyenne,Raisons\n';
                    data.riskStudents.forEach(risk => {
                        const className = appData.classes.find(c => c.id === risk.student.class_id)?.name || 'N/A';
                        csvContent += `${risk.student.last_name},${risk.student.first_name},${className},${risk.absences},${risk.averageGrade}%,${risk.reasons.join('; ')}\n`;
                    });
                }
                
                // Créer et télécharger le fichier
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `Rapport_${formatDate(data.startDate)}_${formatDate(data.endDate)}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                notificationManager.show('Fichier Excel (CSV) exporté avec succès!', 'success');
                
            } catch (error) {
                console.error('Erreur export Excel:', error);
                notificationManager.show('Erreur lors de l\'export Excel', 'error');
            }
        }
        
        // Fonction pour exporter en CSV (identique à Excel mais format différent)
        function exportReportToCSV() {
            exportReportToExcel(); // CSV et Excel utilisent le même format pour les rapports
        }
        
        // Fonction utilitaire pour formater les dates
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR');
        }

        // ====================================================================
        // FONCTIONS UTILITAIRES POUR LES NOUVELLES FONCTIONNALITÉS
        // ====================================================================

        // NOUVEAU: Effacer toutes les notifications
        function clearAllNotifications() {
            if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique des notifications ?')) {
                notificationManager.clearAll();
            }
        }

        // NOUVEAU: Gérer le clic sur la cloche
        function handleNotificationClick() {
            notificationManager.toggleDropdown();
        }

        // ====================================================================
        // CORRECTIONS DES BOUTONS EXISTANTS
        // ====================================================================

        // NOUVEAU: Fonction de déconnexion avec modal personnalisé
        function handleLogout() {
            showModal('logout-confirm-modal');
        }

        // NOUVEAU: Fonction qui effectue réellement la déconnexion
        async function performLogout() {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    console.error('Erreur lors de la déconnexion:', error);
                    notificationManager.show('❌ Erreur lors de la déconnexion', 'error');
                    closeModal('logout-confirm-modal');
                } else {
                    // Cleanup local storage for current user to ensure a fresh start on next login
                    localStorage.removeItem(`notifications_${currentUser.id}`);
                    closeModal('logout-confirm-modal');
                    // The onAuthStateChange event handles the UI transition and appData reset
                }
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
                notificationManager.show('❌ Erreur lors de la déconnexion', 'error');
                closeModal('logout-confirm-modal');
            }
        }

        // ====================================================================
        // FONCTIONS DE PARTAGE MOBILE AMÉLIORÉES
        // ====================================================================

        // Fonction de partage pour Capacitor
        async function shareViaCapacitor(pdfBlob, filename, title) {
            if (typeof Capacitor !== 'undefined' && Capacitor.Plugins?.Share) {
                try {
                    // Convertir le blob en base64 pour Capacitor
                    const base64 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            // Extract only the base64 part (data:application/pdf;base64,...)
                            const base64data = reader.result;
                            resolve(base64data);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(pdfBlob);
                    });
                    
                    await Capacitor.Plugins.Share.share({
                        title: title,
                        text: `Document Perfect School - ${filename}`,
                        url: base64, // Pass the base64 data URL
                        dialogTitle: 'Partager le PDF'
                    });
                    return true;
                } catch (error) {
                    // Check if error is due to user dismissing the share sheet (normal behavior)
                    if (error.message && error.message.includes('User cancelled')) {
                         console.log('Partage annulé par l\'utilisateur.');
                         return true; // Treat as handled
                    }
                    console.log('Capacitor Share non disponible ou a échoué:', error);
                }
            }
            return false;
        }

        // Fonction de partage mobile universelle
        async function sharePDFMobile(pdfBlob, filename, title = "Document Perfect School") {
            try {
                // Essayer d'abord Capacitor
                if (await shareViaCapacitor(pdfBlob, filename, title)) {
                    return true;
                }
                
                // Ensuite Web Share API
                const file = new File([pdfBlob], filename, { type: 'application/pdf' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: title,
                            files: [file]
                        });
                        return true;
                    } catch (shareError) {
                        console.log('Web Share API a échoué, passage au téléchargement:', shareError);
                    }
                }
                
                // Fallback: Téléchargement direct
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = filename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                setTimeout(() => URL.revokeObjectURL(pdfUrl), 30000);
                
                notificationManager.show('✅ PDF téléchargé ! Vérifiez vos téléchargements.', 'success');
                return false;
                
            } catch (error) {
                console.error('Erreur partage mobile:', error);
                notificationManager.show('❌ Erreur lors du partage', 'error');
                throw error;
            }
        }

        // Protection contre les doublons
        const duplicateProtection = {
            isAddingStudent: false,
            isAddingClass: false,
            isEditingStudent: false,
            isJustifyingAbsence: false,
            isAddingGrade: false,
            
            startStudentAdd() {
                if (this.isAddingStudent) {
                    notificationManager.show('⏳ Ajout en cours, veuillez patienter...', 'warning');
                    return false;
                }
                this.isAddingStudent = true;
                const btn = document.getElementById('add-student-submit');
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<svg class="loading-spinner h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Ajout en cours...';
                }
                return true;
            },
            
            endStudentAdd() {
                this.isAddingStudent = false;
                const btn = document.getElementById('add-student-submit');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Ajouter l\'élève';
                }
            },
            
            startClassAdd() {
                if (this.isAddingClass) {
                    notificationManager.show('⏳ Création en cours, veuillez patienter...', 'warning');
                    return false;
                }
                this.isAddingClass = true;
                const btn = document.getElementById('add-class-submit');
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<svg class="loading-spinner h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Création en cours...';
                }
                return true;
            },
            
            endClassAdd() {
                this.isAddingClass = false;
                const btn = document.getElementById('add-class-submit');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Créer la classe';
                }
            },
            
            startStudentEdit() {
                if (this.isEditingStudent) {
                    notificationManager.show('⏳ Modification en cours, veuillez patienter...', 'warning');
                    return false;
                }
                this.isEditingStudent = true;
                const btn = document.getElementById('edit-student-submit');
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<svg class="loading-spinner h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Modification en cours...';
                }
                return true;
            },
            
            endStudentEdit() {
                this.isEditingStudent = false;
                const btn = document.getElementById('edit-student-submit');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Modifier l\'élève';
                }
            },

            startJustifyAbsence() {
                if (this.isJustifyingAbsence) {
                    notificationManager.show('⏳ Justification en cours, veuillez patienter...', 'warning');
                    return false;
                }
                this.isJustifyingAbsence = true;
                const btn = document.querySelector('#justify-absence-form button[type="submit"]');
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<svg class="loading-spinner h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Justification en cours...';
                }
                return true;
            },

            endJustifyAbsence() {
                this.isJustifyingAbsence = false;
                const btn = document.querySelector('#justify-absence-form button[type="submit"]');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Justifier l\'absence';
                }
            },

            startGradeAdd() {
                if (this.isAddingGrade) {
                    notificationManager.show('⏳ Ajout en cours, veuillez patienter...', 'warning');
                    return false;
                }
                this.isAddingGrade = true;
                const btn = document.querySelector('#add-grade-form button[type="submit"]');
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<svg class="loading-spinner h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Ajout en cours...';
                }
                return true;
            },

            endGradeAdd() {
                this.isAddingGrade = false;
                const btn = document.querySelector('#add-grade-form button[type="submit"]');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Ajouter la note';
                }
            }
        };

        // Initialisation de Supabase
        function initializeSupabase() {
            try {
                const SUPABASE_URL = "https://xvrxfwbdzyhuexnwkgdk.supabase.co";
                const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cnhmd2JkenlodWV4bndrZ2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NzUyMjUsImV4cCI6MjA3NzU1MTIyNX0.ag0c96y4Pz-yT2wlpI8cwDaVvMkYqatKWgLCDBpxr_M";
                
                // Récupérer le global Supabase quelle que soit la forme exposée par le script UMD
                console.log('🔍 Vérification des globals Supabase:', 
                    'window.supabase =', typeof window !== 'undefined' ? window.supabase : 'no-window',
                    'supabase =', (typeof supabase !== 'undefined') ? supabase : 'undefined'
                );
                const supabaseGlobal = (typeof window !== 'undefined' && window.supabase)
                    ? window.supabase
                    : (typeof supabase !== 'undefined' ? supabase : null);
                
                if (!supabaseGlobal || typeof supabaseGlobal.createClient !== 'function') {
                    throw new Error('La librairie Supabase n\'est pas chargée');
                }
                
                supabase = supabaseGlobal.createClient(SUPABASE_URL, SUPABASE_KEY, {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: false
                    }
                });

                // L'écouteur est toujours utile pour la DÉCONNEXION.
                supabase.auth.onAuthStateChange((_event, session) => {
                    if (_event === 'SIGNED_OUT') {
                        showLogin();
                    }
                });

                console.log('✅ Supabase initialisé avec succès');
                return true;
            } catch (error) {
                console.error('❌ Erreur lors de l\'initialisation de Supabase:', error);
                return false;
            }
        }

        // Charger les paramètres depuis le localStorage
        function loadSettings() {
            const saved = localStorage.getItem('app-settings');
            if (saved) {
                const parsedSettings = JSON.parse(saved);
                appData.settings = { 
                    ...appData.settings, 
                    ...parsedSettings,
                    // NOUVEAU: Assurer la rétrocompatibilité avec les nouvelles fonctionnalités
                    feries: parsedSettings.feries || [],
                    attendanceTimes: parsedSettings.attendanceTimes || {
                        presentUntil: "07:59",
                        lateUntil: "15:00", 
                        autoAbsentAfter: "15:00"
                    }
                };
            }
            
            const theme = appData.settings.theme || 'light';
            document.body.setAttribute('data-theme', theme);
            document.getElementById('app-name').textContent = appData.settings.appName;
        }

        function saveSettings() {
            localStorage.setItem('app-settings', JSON.stringify(appData.settings));
        }

        // Initialisation
        document.addEventListener('DOMContentLoaded', async function() {
            console.log('🚀 Initialisation de l\'application...');
            
            if (!initializeSupabase()) {
                return;
            }
            
            setupEventListeners();
            loadSettings();
            enableSwipeNavigation();
        });

        // Navigation par swipe
        function enableSwipeNavigation() {
            let touchStartX = 0;
            let touchStartY = 0;
            
            document.addEventListener('touchstart', e => {
                // Ignore swipes on scrollable elements or inputs
                if (e.target.closest('.scroll-touch, .dialog-content, input, textarea, select')) {
                    return;
                }
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            });

            document.addEventListener('touchend', e => {
                 if (e.target.closest('.scroll-touch, .dialog-content, input, textarea, select')) {
                    return;
                }
                const touchEndX = e.changedTouches[0].screenX;
                const touchEndY = e.changedTouches[0].screenY;
                const diffX = touchStartX - touchEndX;
                const diffY = touchStartY - touchEndY;
                
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    const pages = ['dashboard', 'students', 'subjects', 'attendance', 'history', 'settings'];
                    const currentIndex = pages.indexOf(currentPage);
                    
                    if (diffX > 0 && currentIndex < pages.length - 1) {
                        loadPage(pages[currentIndex + 1]);
                    } else if (diffX < 0 && currentIndex > 0) {
                        loadPage(pages[currentIndex - 1]);
                    }
                }
            });
        }

async function handleUserSession(session) {
    if (!session || !session.user) {
        showLogin();
        return;
    }
    currentUser = session.user;
    document.getElementById('user-email').textContent = currentUser.email;

    currentMemberContext = null;
    effectiveUserId = null;

    try {
        const { data: memberRow } = await supabase
            .from('members')
            .select('*')
            .eq('auth_user_id', currentUser.id)
            .maybeSingle();

        if (memberRow) {
            currentMemberContext = memberRow;
            effectiveUserId = memberRow.owner_user_id;
        } else {
            effectiveUserId = currentUser.id;
        }
    } catch (err) {
        console.error('Erreur (catch) lors de la vérification du statut de membre:', err);
        effectiveUserId = currentUser.id;
    }

    // On charge TOUTES les données de l'école (version optimisée)
    await loadAllDataOptimized(); 

    // NOUVEAU: Sauvegarder TOUS les élèves AVANT le filtrage pour le calcul du vrai rang
    allSchoolStudents = [...appData.students];

    // Masquer les boutons pour les membres non-admin
    // Écrit par mohamed
    hideButtonsForNonAdminMembers();

    // --- NOUVELLE ÉTAPE : FILTRAGE DES DONNÉES EN LOCAL ---
    // Si l'utilisateur est un membre, on filtre les données qu'il peut voir en local.
    // Écrit par khaled
    if (currentMemberContext) {
        const role = currentMemberContext.role;
        console.log(`Filtrage des données locales pour le rôle : ${role}`);

        if (role === 'proffesseur') {
            const assignedClassIds = new Set(currentMemberContext.assigned_class_ids || []);
            // Le professeur ne voit que les classes et les élèves des classes qui lui sont assignées.
            appData.classes = appData.classes.filter(c => assignedClassIds.has(c.id));
            appData.students = appData.students.filter(s => assignedClassIds.has(s.class_id));
        } else if (role === 'parent') {
            const assignedStudentIds = new Set(currentMemberContext.assigned_student_ids || []);
            // Le parent ne voit que ses enfants et la classe de ses enfants.
            appData.students = appData.students.filter(s => assignedStudentIds.has(s.id));
            const parentClassIds = new Set(appData.students.map(s => s.class_id));
            appData.classes = appData.classes.filter(c => parentClassIds.has(c.id));
        }
    }
    // --- FIN DU FILTRAGE ---

    // Appliquer les permissions AVANT d'afficher le dashboard pour éviter le flash
    applyRoleBasedUI();

    notificationManager.loadNotifications();
    showDashboard();
    loadPage('dashboard');
}

// Fonction pour masquer les boutons pour les membres non-admin
// Écrit par mohamed
function hideButtonsForNonAdminMembers() {
    // Masquer les boutons modifier/supprimer dans le profil élève
    const editBtn = document.getElementById('edit-student-btn-profile');
    const deleteBtn = document.getElementById('delete-student-btn-profile');
    const notificationsContainer = document.getElementById('notifications-container');
    
    if (currentMemberContext) {
        // Cacher les boutons pour les membres (parent, professeur, gardien)
        if (editBtn) editBtn.style.display = 'none';
        if (deleteBtn) deleteBtn.style.display = 'none';
        if (notificationsContainer) notificationsContainer.style.display = 'none';
    } else {
        // Afficher les boutons pour l'admin
        if (editBtn) editBtn.style.display = '';
        if (deleteBtn) deleteBtn.style.display = '';
        if (notificationsContainer) notificationsContainer.style.display = '';
    }
}

        // Charger les paramètres de l'école
        async function loadSchoolSettings() {
            try {
                if (!effectiveUserId) return;
                if (!currentUser) return;

                const { data, error } = await supabase
                    .from('school_settings')
                    .select('*')
                    .eq('user_id', effectiveUserId)
                    .single();

                if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
                    console.error('Erreur chargement paramètres école:', error);
                }

                if (data) {
                    appData.schoolSettings = data;
                    // SUPPRESSION: Retrait de logo_url
                    delete appData.schoolSettings.logo_url;
                    
                    // CORRECTION: Synchroniser le nom de l'application depuis Supabase
                    if (data.school_name) {
                        appData.settings.appName = data.school_name;
                        // Sauvegarder aussi dans localStorage pour cohérence
                        saveSettings();
                    }
                    
                    updateSchoolNameInUI();
                }
            } catch (error) {
                console.error('Erreur chargement paramètres école:', error);
            }
        }

        // Mettre à jour le nom de l'école dans l'UI
        function updateSchoolNameInUI() {
            // CORRECTION: Utiliser appData.settings.appName en priorité (synchronisé avec Supabase)
            const schoolName = appData.settings.appName || appData.schoolSettings.school_name || 'Perfect School';
            document.getElementById('app-name').textContent = schoolName;
            if (document.getElementById('login-school-name')) {
                document.getElementById('login-school-name').textContent = schoolName;
            }
            
            // Mettre à jour les valeurs par défaut dans les formulaires
            const schoolInputs = document.querySelectorAll('input[id$="school"]');
            schoolInputs.forEach(input => {
                if (input.value === 'Perfect School' || !input.value) {
                    input.value = schoolName;
                }
            });
        }

        // CORRECTION: Regroupement de tous les chargements de données
        async function loadAllData() {
    try {
        if (!currentUser) throw new Error("Utilisateur non authentifié.");
        console.log('🔄 Chargement de toutes les données...');
        
        // Charger les données de manière séquentielle pour mieux debugger
        await loadSchoolSettings();
        await loadClassesFromSupabase();
        await loadStudentsFromSupabase();
        await loadAttendanceFromSupabase();
        await loadAbsenceJustificationsFromSupabase();
        await loadSubjectsFromSupabase();
        await loadGradesFromSupabase();
        await loadMembersFromSupabase(); 
        
        console.log('✅ Toutes les données ont été chargées avec succès.');
    } catch (error) {
        console.error("❌ Erreur critique lors du chargement des données:", error);
        
        // Afficher un message d'erreur plus détaillé
        const errorMsg = error.message.includes('500') 
            ? 'Erreur serveur. Vérifiez les politiques RLS dans Supabase.' 
            : error.message;
            
        notificationManager.show("Erreur de chargement: " + errorMsg, "error");
        
        // Ne pas déconnecter immédiatement, laisser une chance à l'utilisateur
        console.log("⚠️ Chargement partiel - continuation avec les données disponibles");
    }
}

        // ====================================================================
        // NOUVELLE VERSION OPTIMISÉE : Chargement intelligent en 3 phases
        // ====================================================================
        
        // Système de cache intelligent
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        const CACHE_PREFIX = 'perfect_school_cache_';
        
        function getCacheKey(key) {
            return `${CACHE_PREFIX}${effectiveUserId}_${key}`;
        }
        
        function getCachedData(key) {
            try {
                const cached = localStorage.getItem(getCacheKey(key));
                if (!cached) return null;
                
                const { data, timestamp } = JSON.parse(cached);
                const age = Date.now() - timestamp;
                
                if (age > CACHE_DURATION) {
                    localStorage.removeItem(getCacheKey(key));
                    return null;
                }
                
                return data;
            } catch (e) {
                return null;
            }
        }
        
        function setCachedData(key, data) {
            try {
                const cacheData = {
                    data: data,
                    timestamp: Date.now()
                };
                localStorage.setItem(getCacheKey(key), JSON.stringify(cacheData));
            } catch (e) {
                console.warn('Erreur cache localStorage:', e);
            }
        }
        
        // Fonctions de chargement avec pagination progressive
        async function loadStudentsFromSupabaseOptimized(limit = 100) {
            if (!effectiveUserId) return;
            try {
                const cacheKey = 'students_first_' + limit;
                const cached = getCachedData(cacheKey);
                if (cached) {
                    appData.students = cached;
                    console.log('📦 Élèves chargés depuis le cache');
                    return;
                }
                
                // Pour peu d'élèves, charger tout directement (plus rapide)
                const { data, error } = await supabase
                    .from('students')
                    .select('*')
                    .eq('user_id', effectiveUserId)
                    .limit(limit)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                appData.students = data || [];
                appData.studentsTotalCount = appData.students.length;
                
                // Si on a chargé moins que la limite, c'est qu'on a tout chargé
                if (appData.students.length < limit) {
                    appData.studentsTotalCount = appData.students.length;
                }
                
                setCachedData(cacheKey, appData.students);
                
                console.log(`✅ ${appData.students.length} élèves chargés`);
            } catch (error) {
                console.error('Erreur chargement élèves:', error);
                appData.students = [];
            }
        }
        
        async function loadAttendanceFromSupabaseOptimized(days = 30) {
            if (!effectiveUserId) return;
            try {
                const cacheKey = 'attendance_last_' + days;
                const cached = getCachedData(cacheKey);
                if (cached) {
                    appData.attendance = cached;
                    console.log('📦 Présences chargées depuis le cache');
                    return;
                }
                
                const dateLimit = new Date();
                dateLimit.setDate(dateLimit.getDate() - days);
                const dateLimitStr = dateLimit.toISOString().split('T')[0];
                
                // Retirer count: 'exact' qui est très lent, et limiter les résultats
                const { data, error } = await supabase
                    .from('attendance')
                    .select('*')
                    .eq('user_id', effectiveUserId)
                    .gte('date', dateLimitStr)
                    .order('date', { ascending: false })
                    .limit(1000); // Limiter à 1000 présences max pour éviter les timeouts
                
                if (error) throw error;
                
                appData.attendance = data || [];
                appData.attendanceTotalCount = appData.attendance.length;
                setCachedData(cacheKey, appData.attendance);
                
                console.log(`✅ ${appData.attendance.length} présences chargées (${days} derniers jours)`);
            } catch (error) {
                console.error('Erreur chargement présences:', error);
                appData.attendance = [];
            }
        }
        
        async function loadAbsenceJustificationsFromSupabaseOptimized(limit = 50) {
            if (!effectiveUserId) return;
            try {
                const cacheKey = 'justifications_recent_' + limit;
                const cached = getCachedData(cacheKey);
                if (cached) {
                    appData.absenceJustifications = cached;
                    console.log('📦 Justifications chargées depuis le cache');
                    return;
                }
                
                const { data, error } = await supabase
                    .from('absence_justifications')
                    .select('*')
                    .eq('user_id', effectiveUserId)
                    .limit(limit)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                appData.absenceJustifications = data || [];
                setCachedData(cacheKey, appData.absenceJustifications);
                
                console.log(`✅ ${appData.absenceJustifications.length} justifications récentes chargées`);
            } catch (error) {
                console.error('Erreur chargement justifications:', error);
                appData.absenceJustifications = [];
            }
        }
        
        // Fonction de chargement à la demande (pour charger plus de données)
        async function loadMoreStudents(offset = 0, limit = 100) {
            if (!effectiveUserId) return [];
            try {
                const { data, error } = await supabase
                    .from('students')
                    .select('*')
                    .eq('user_id', effectiveUserId)
                    .range(offset, offset + limit - 1)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                if (data && data.length > 0) {
                    appData.students = [...appData.students, ...data];
                    console.log(`✅ ${data.length} élèves supplémentaires chargés`);
                }
                
                return data || [];
            } catch (error) {
                console.error('Erreur chargement élèves supplémentaires:', error);
                return [];
            }
        }
        
        async function loadMoreAttendance(startDate, endDate) {
            if (!effectiveUserId) return [];
            try {
                const { data, error } = await supabase
                    .from('attendance')
                    .select('*')
                    .eq('user_id', effectiveUserId)
                    .gte('date', startDate)
                    .lte('date', endDate)
                    .order('date', { ascending: false });
                
                if (error) throw error;
                
                if (data && data.length > 0) {
                    // Fusionner avec les données existantes (éviter les doublons)
                    const existingIds = new Set(appData.attendance.map(a => a.id));
                    const newData = data.filter(a => !existingIds.has(a.id));
                    appData.attendance = [...appData.attendance, ...newData];
                    console.log(`✅ ${newData.length} présences supplémentaires chargées`);
                }
                
                return data || [];
            } catch (error) {
                console.error('Erreur chargement présences supplémentaires:', error);
                return [];
            }
        }
        
        // NOUVELLE FONCTION OPTIMISÉE : Chargement intelligent en 3 phases
        // Écrit par mohamed
        async function loadAllDataOptimized() {
            const startTime = performance.now();
            
            try {
                if (!currentUser) throw new Error("Utilisateur non authentifié.");
                console.log('🚀 Chargement optimisé de toutes les données...');
                
                // ============================================================
                // PHASE 1 : Données PRIORITAIRES - Élèves et Classes (affichage immédiat)
                // Écrit par khaled
                // ============================================================
                console.log('📊 Phase 1 : Chargement des données prioritaires (Élèves et Classes)...');
                const phase1Start = performance.now();
                
                // Charger les classes et les élèves en parallèle (priorité absolue)
                await Promise.allSettled([
                    loadSchoolSettings(),
                    loadClassesFromSupabase(),
                    loadStudentsFromSupabaseOptimized(100) // Charger les élèves en priorité
                ]);
                
                const phase1Time = ((performance.now() - phase1Start) / 1000).toFixed(2);
                console.log(`✅ Phase 1 terminée en ${phase1Time}s - Élèves et Classes chargés`);
                
                // Afficher l'interface rapidement avec les données prioritaires
                showDashboard();
                
                // ============================================================
                // PHASE 2 : Données SECONDAIRES (en parallèle)
                // Écrit par mohamed
                // ============================================================
                console.log('📚 Phase 2 : Chargement des données secondaires...');
                const phase2Start = performance.now();
                
                await Promise.allSettled([
                    loadSubjectsFromSupabase(),
                    loadGradesFromSupabase(),
                    loadMembersFromSupabase()
                ]);
                
                const phase2Time = ((performance.now() - phase2Start) / 1000).toFixed(2);
                console.log(`✅ Phase 2 terminée en ${phase2Time}s`);
                
                // ============================================================
                // PHASE 3 : Données LOURDES (avec pagination intelligente)
                // Écrit par khaled
                // ============================================================
                console.log('📦 Phase 3 : Chargement des données volumineuses...');
                const phase3Start = performance.now();
                
                // Charger les autres données en parallèle (en arrière-plan)
                await Promise.allSettled([
                    loadAttendanceFromSupabaseOptimized(30), // 30 derniers jours
                    loadAbsenceJustificationsFromSupabaseOptimized(50) // 50 dernières justifications
                ]);
                
                const phase3Time = ((performance.now() - phase3Start) / 1000).toFixed(2);
                console.log(`✅ Phase 3 terminée en ${phase3Time}s`);
                
                // ============================================================
                // RÉSULTAT FINAL
                // ============================================================
                const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
                console.log(`🎉 Toutes les données chargées avec succès en ${totalTime}s`);
                
                // Initialiser les compteurs si nécessaire
                if (!appData.studentsTotalCount) appData.studentsTotalCount = appData.students.length;
                if (!appData.attendanceTotalCount) appData.attendanceTotalCount = appData.attendance.length;
                
            } catch (error) {
                console.error("❌ Erreur critique lors du chargement optimisé:", error);
                
                // Afficher un message d'erreur plus détaillé
                const errorMsg = error.message.includes('500') 
                    ? 'Erreur serveur. Vérifiez les politiques RLS dans Supabase.' 
                    : error.message;
                    
                notificationManager.show("Erreur de chargement: " + errorMsg, "error");
                
                // Fallback : utiliser l'ancienne méthode si la nouvelle échoue
                console.log("⚠️ Tentative de fallback avec l'ancienne méthode...");
                try {
                    await loadAllData();
                } catch (fallbackError) {
                    console.error("❌ Fallback échoué:", fallbackError);
                    console.log("⚠️ Continuation avec les données disponibles");
                }
            }
        }
        
        // Fonction pour vider le cache si nécessaire
        function clearDataCache() {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith(CACHE_PREFIX)) {
                        localStorage.removeItem(key);
                    }
                });
                console.log('🗑️ Cache vidé');
            } catch (e) {
                console.error('Erreur vidage cache:', e);
            }
        }

        async function loadClassesFromSupabase() {
            if (!effectiveUserId) return;
            const { data, error } = await supabase.from('classes').select('*').eq('user_id', effectiveUserId);
            if (error) throw error;
            appData.classes = data || [];
        }

        async function loadStudentsFromSupabase() {
        if (!effectiveUserId) return;
    const { data, error } = await supabase.from('students').select('*').eq('user_id', effectiveUserId);
    if (error) throw error;
    appData.students = data || [];
        }

        async function loadAttendanceFromSupabase() {
            if (!effectiveUserId) return;
            const { data, error } = await supabase.from('attendance').select('*').eq('user_id', effectiveUserId);
            if (error) throw error;
            appData.attendance = data || [];
        }
         async function loadAbsenceJustificationsFromSupabase() {
            if (!effectiveUserId) return;
            const { data, error } = await supabase.from('absence_justifications').select('*').eq('user_id', effectiveUserId);
            if (error) throw error;
            appData.absenceJustifications = data || [];
        }


        function showLogin() {
            document.getElementById('login-page').classList.remove('hidden');
            document.getElementById('dashboard').classList.add('hidden');
            // Retirer la classe permissions-applied pour que les onglets soient cachés par défaut à la prochaine connexion
            document.body.classList.remove('permissions-applied');
        }

        function showDashboard() {
            document.getElementById('login-page').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
        }

// ====================================================================
// NOUVEAU BLOC : CENTRE DE CONTRÔLE DES PERMISSIONS (RBAC)
// ====================================================================

// --- Fonctions utilitaires pour manipuler l'interface ---

/**
 * Cache complètement un onglet dans la navigation desktop et mobile.
 * @param {string} tabName Le nom de la page (ex: 'settings').
 */
function hideTab(tabName) {
    document.querySelectorAll(`[data-page="${tabName}"]`).forEach(el => el.style.display = 'none');
}

/**
 * Cache tous les onglets SAUF ceux listés dans allowedTabs.
 * @param {string[]} allowedTabs Un tableau avec les noms des pages à afficher.
 */
function showOnlyTabs(allowedTabs) {
    const allTabs = ['dashboard', 'students', 'subjects', 'attendance', 'history', 'accounts', 'settings'];
    allTabs.forEach(tab => {
        if (!allowedTabs.includes(tab)) {
            hideTab(tab);
        } else {
            // Afficher les onglets autorisés
            document.querySelectorAll(`[data-page="${tab}"]`).forEach(el => {
                // Les onglets mobiles utilisent flex, les onglets desktop reviennent au style par défaut
                if (el.classList.contains('mobile-nav-btn')) {
                    el.style.display = 'flex';
                } else {
                    // Pour les onglets desktop, on retire le style inline pour revenir au style CSS par défaut
                    el.style.display = '';
                }
            });
        }
    });
}

/**
 * Cache n'importe quel élément de la page en utilisant un sélecteur CSS.
 * @param {string} selector Le sélecteur CSS de l'élément à cacher (ex: '.btn-danger').
 */
function hideElement(selector) {
    document.querySelectorAll(selector).forEach(el => el.style.display = 'none');
}

// Fonction pour cacher tous les boutons de partage (appelée après chaque chargement de page)
function hideAllShareButtons() {
    // Ne cacher que si l'utilisateur est un membre (pas un administrateur)
    if (!currentMemberContext) return;
    
    // Liste de tous les sélecteurs possibles pour les boutons de partage
    const shareSelectors = [
        '[onclick*="share"]',
        '[onclick="shareStudentProfileAsync()"]',
        '[onclick="shareStudentHistoryAsync()"]',
        '[onclick="shareHistoryToPDFAsync()"]',
        '[onclick="showShareClassProfilesModal()"]',
        '[onclick="shareRankingPDF()"]',
        'button[title*="Partager"]',
        'button[title*="partager"]',
        '.compact-share-buttons button[onclick*="share"]'
    ];
    
    shareSelectors.forEach(selector => {
        hideElement(selector);
    });
    
    // Cacher aussi les boutons de partage dans les conteneurs compacts
    document.querySelectorAll('.compact-share-buttons button').forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes('share')) {
            btn.style.display = 'none';
        }
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('share')) {
            btn.style.display = 'none';
        }
        if (btn.title && btn.title.toLowerCase().includes('partager')) {
            btn.style.display = 'none';
        }
    });
}

function lockElement(selector, message = "L'établissement ne permet pas cette action.") {
    document.querySelectorAll(selector).forEach(el => {
        // 1. On le grise pour qu'il ait l'air désactivé
        el.style.opacity = '0.6';
        el.style.cursor = 'not-allowed'; // Le curseur devient "interdit"

        // 2. On ajoute un "piège" sur le clic
        el.addEventListener('click', function(event) {
            // 3. On annule l'action normale du bouton
            event.preventDefault();
            event.stopPropagation();
            
            // 4. On affiche ton message personnalisé
            notificationManager.show('🔒 ' + message, 'warning');
        }, true); // Le "true" est important, il s'assure que notre piège s'active en premier
    });
}


// --- La NOUVELLE fonction centrale pour appliquer les permissions ---

function applyRoleBasedUI() {
    // Si ce n'est pas un membre, c'est le propriétaire. On s'assure que tout est visible et on arrête.
    if (!currentMemberContext) {
        console.log('👑 Mode Propriétaire. Accès total activé.');
        showOnlyTabs(['dashboard', 'students', 'subjects', 'attendance', 'history', 'accounts', 'settings']);
        // Marquer que les permissions ont été appliquées
        document.body.classList.add('permissions-applied');
        return;
    }

    const role = currentMemberContext.role;
    console.log(`Applique les restrictions d'interface pour le rôle : ${role}`);

    // --- RÈGLE UNIVERSELLE POUR TOUS LES MEMBRES ---
    // Aucun membre ne peut partager d'informations - CACHER COMPLÈTEMENT TOUS LES BOUTONS DE PARTAGE
    hideAllShareButtons();
    // Aucun membre ne peut accéder au Centre de Rapports.
    hideElement('[onclick="showReportCenter()"]');
    // --- FIN DE LA RÈGLE UNIVERSELLE ---

    // --- Permissions pour le GARDIEN ---
    if (role === 'gardiant') {
        // Affiche SEULEMENT les onglets Présence et Historique
        showOnlyTabs(['attendance', 'history']);
        
        // --- TES NOUVELLES RÈGLES ---
        // 1. Verrouiller les 4 boîtes de stats sur l'Accueil (même s'il n'y va pas)
        lockElement('[onclick="loadPage(\'students\')"]', "L'accès à cette page est restreint.");
        lockElement('[onclick="loadPage(\'attendance\')"]', "L'accès à cette page est restreint.");

        // 2. Les boutons de partage sont déjà cachés par la règle universelle
        // --- FIN DE TES NOUVELLES RÈGLES ---

        // On verrouille les autres boutons (comme on avait dit)
        lockElement('[onclick*="justifyAbsence"]', "Vous ne pouvez pas justifier une absence.");
        lockElement('[onclick*="showEditAttendanceModal"]', "Vous ne pouvez pas modifier une présence.");
        
        // On bloque l'accès au profil (ton code le fait déjà, c'est parfait)
        window.originalShowStudentProfile = window.originalShowStudentProfile || window.showStudentProfile;
        window.showStudentProfile = function() {
            console.log("Accès au profil bloqué pour le gardien.");
            notificationManager.show("Accès non autorisé", "warning");
        };
    }

    // --- Permissions pour le PARENT ---
     else if (role === 'parent') {
        // Affiche SEULEMENT les onglets Dashboard et Historique
        showOnlyTabs(['dashboard', 'history']);
        
        // --- TES NOUVELLES RÈGLES ---
        // 1. Verrouiller les 4 boîtes de stats sur l'Accueil
        lockElement('[onclick="loadPage(\'students\')"]', "L'accès à cette page est restreint.");
        lockElement('[onclick="loadPage(\'attendance\')"]', "L'accès à cette page est restreint.");

        // 2. Les boutons de partage sont déjà cachés par la règle universelle
        // --- FIN DE TES NOUVELLES RÈGLES ---
        
        // On verrouille TOUS les autres boutons d'action
        lockElement('[onclick*="showModal"]', "Action non autorisée pour ce compte."); 
        lockElement('[onclick*="delete"]', "Action non autorisée pour ce compte.");
        lockElement('[onclick*="justifyAbsence"]', "Action non autorisée pour ce compte.");
        // Les boutons de partage dans compact-share-buttons sont déjà cachés par la règle universelle

        // *** AJOUTE CETTE LIGNE SPÉCIFIQUE ICI ***
        lockElement('[onclick*="showEditAttendanceModal"]', "Action non autorisée pour ce compte.");
    }
    // --- Permissions pour le PROFESSEUR ---
    else if (role === 'proffesseur') {
        // Affiche ses onglets (Dashboard, Notes, Présence, Historique)
        showOnlyTabs(['dashboard', 'subjects', 'attendance', 'history']);
        
        // Cache les onglets admin (qu'il ne doit pas voir)
        hideTab('students'); 
        hideTab('accounts');
        hideTab('settings');

        
        // --- TES NOUVELLES RÈGLES DE VERROUILLAGE ---
        
        // 1. Verrouiller les 2 cartes admin "Total Élèves" et "Total Classe" sur le Dashboard
        //    (Le sélecteur [onclick="loadPage('students')"] cible les deux cartes)
        lockElement('[onclick="loadPage(\'students\')"]', "L'accès à cette page est restreint.");

        // 2. Verrouiller le bouton "Ajouter une matière"
        lockElement('[onclick*="showAddSubjectModal"]', "Seul l'administrateur peut ajouter des matières.");

        // 3. Les boutons de partage sont déjà cachés par la règle universelle
        // --- FIN DE TES NOUVELLES RÈGLES ---

        
        // --- On garde aussi les anciens verrouillages (pour la gestion des élèves/matières) ---

        // Sur le profil élève (s'il y accède) :
        // Verrouille "Modifier l'élève"
        lockElement('[onclick*="showEditStudentModal"]', "Action non autorisée pour ce compte.");
        // Verrouille "Supprimer l'élève"
        lockElement('[onclick*="confirmDeleteStudentFromProfile"]', "Action non autorisée pour ce compte.");
        
        // Sur la page Matières & Notes (subjects) :
        // (On a déjà verrouillé "Ajouter une matière" en haut)
        // Verrouille "Modifier la matière"
        lockElement('[onclick*="showEditSubjectModal"]', "Seul l'administrateur peut modifier une matière.");
        // Verrouille "Supprimer la matière"
        lockElement('[onclick*="confirmDeleteSubject"]', "Seul l'administrateur peut supprimer une matière.");
    }
    
    // Marquer que les permissions ont été appliquées
    document.body.classList.add('permissions-applied');
}

        // Événements
        function setupEventListeners() {
            document.getElementById('login-form').addEventListener('submit', handleLogin);
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
            document.getElementById('theme-toggle').addEventListener('click', toggleTheme);document.getElementById('notifications-btn').addEventListener('click', (event) => {
                // On stoppe le clic ici, pour qu'il n'aille pas au "document"
                event.stopPropagation(); 
                
                // On appelle la fonction pour ouvrir/fermer le menu
                handleNotificationClick();
            });
            
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const page = e.currentTarget.getAttribute('data-page');
                    loadPage(page);
                });
            });

            document.getElementById('add-student-form').addEventListener('submit', handleAddStudent);
            document.getElementById('edit-student-form').addEventListener('submit', handleEditStudent);
            document.getElementById('add-class-form').addEventListener('submit', handleAddClass);
            document.getElementById('justify-absence-form').addEventListener('submit', handleJustifyAbsence);
            document.getElementById('add-subject-form').addEventListener('submit', handleAddSubject);
            document.getElementById('edit-subject-form').addEventListener('submit', handleEditSubject);
            document.getElementById('add-grade-form').addEventListener('submit', handleAddGrade);
            document.getElementById('edit-grade-form').addEventListener('submit', handleEditGrade);

            // Gestion des photos
            document.getElementById('student-photo').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('photo-preview').classList.remove('hidden');
                        document.getElementById('preview-image').src = event.target.result;
                    }
                    reader.readAsDataURL(file);
                }
            });

            document.getElementById('edit-student-photo').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('edit-preview-image').src = event.target.result;
                    }
                    reader.readAsDataURL(file);
                }
            });

            document.getElementById('justification-proof').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('justification-proof-preview').classList.remove('hidden');
                        document.getElementById('justification-preview-image').src = event.target.result;
                    }
                    reader.readAsDataURL(file);
                }
            });
            // Fermer le dropdown des notifications si on clique en dehors
            document.addEventListener('click', function(event) {
                const dropdown = document.getElementById('notifications-dropdown');
                const btn = document.getElementById('notifications-btn');
                if (!dropdown.classList.contains('hidden') && !dropdown.contains(event.target) && !btn.contains(event.target)) {
                    dropdown.classList.add('hidden');
                }
            });
        }

       async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    
    showLoginLoading(true);
    errorDiv.classList.add('hidden');
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        // Si Supabase renvoie une erreur (ex: mot de passe incorrect)
        if (error) {
            throw error;
        }
        
        // Si Supabase renvoie des données utilisateur valides
        if (data && data.user) {
            console.log('✅ Connexion réussie, lancement de la session...');
            // On ne s'arrête PAS. On lance manuellement la séquence de démarrage.
            // "data" ici est l'objet "session" que handleUserSession attend.
            await handleUserSession(data); // <-- C'EST LA LIGNE QUI CHANGE TOUT
            return; // Maintenant on peut s'arrêter car tout est lancé.
        }
        
        // Si, pour une raison étrange, il n'y a ni erreur ni data.user
        throw new Error("Réponse d'authentification inattendue.");
        
    } catch (error) {
        console.error('Erreur de connexion:', error);
        errorDiv.textContent = getAuthErrorMessage(error.message);
        errorDiv.classList.remove('hidden');
        notificationManager.show('Erreur de connexion', 'error');
    } finally {
        showLoginLoading(false);
    }
}

        function showLoginLoading(show) {
            const loginText = document.getElementById('login-text');
            const loginLoading = document.getElementById('login-loading');
            const button = loginText.parentElement;

            if (show) {
                loginText.style.display = 'none';
                loginLoading.style.display = 'inline-flex';
                button.disabled = true;
            } else {
                loginText.style.display = 'inline-flex';
                loginLoading.style.display = 'none';
                button.disabled = false;
            }
        }

        function getAuthErrorMessage(errorMessage) {
            const messages = {
                'Invalid login credentials': 'Email ou mot de passe incorrect.',
                'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter.',
                'User already registered': 'Un compte existe déjà avec cet email.',
                'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères.',
                'To signup, please provide your email': 'Veuillez fournir un email valide.',
                'Signup requires a valid password': 'Veuillez fournir un mot de passe valide.',
                'Network Error': 'Erreur de réseau. Vérifiez votre connexion.',
                'Auth session missing': 'Session expirée, veuillez vous reconnecter.'
            };
            return messages[errorMessage] || 'Erreur d\'authentification. Veuillez réessayer.';
        }

        function toggleTheme() {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.body.setAttribute('data-theme', newTheme);
            
            appData.settings.theme = newTheme;
            saveSettings();
            
            const icon = document.querySelector('#theme-toggle i');
            if (icon) {
                icon.setAttribute('data-lucide', newTheme === 'light' ? 'sun' : 'moon');
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }
            }
        }

        // Gestion des pages
        function loadPage(page) {
            currentPage = page;
            
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('nav-active');
                if (btn.getAttribute('data-page') === page) {
                    btn.classList.add('nav-active');
                }
            });

            const content = document.getElementById('page-content');
            content.innerHTML = '<div class="flex items-center justify-center min-h-64"><div class="loading-spinner rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';

            setTimeout(() => {
                switch(page) {
                    case 'dashboard':
                        loadDashboardPage();
                        break;
                    case 'students':
                        loadStudentsPage();
                        break;
                    case 'subjects':
                        loadSubjectsPage();
                        break;
                    case 'attendance':
                        loadAttendancePage();
                        break;
                    case 'history':
                        loadHistoryPage();
                        break;
                    case 'accounts': // NOUVEAU: page Compte
                        loadAccountsPage();
                        break;
                    case 'settings':
                        loadSettingsPage();
                        break;
                }
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }

                // *** AJOUTE CETTE LIGNE DE SÉCURITÉ ICI ***
                // Cela force l'application à revérifier les permissions
                // et à verrouiller les boutons APRÈS que la page soit chargée.
                applyRoleBasedUI(); 
                
            }, 150);
        }
        
        

        function loadDashboardPage() {
            const selectedDateAttendance = getAttendanceForDate(currentDashboardDate);
            const today = new Date().toISOString().split('T')[0];
            const isToday = currentDashboardDate === today;
            const isFerieToday = isFerie(new Date(currentDashboardDate));

            const stats = {
                totalStudents: appData.students.length,
                totalClasses: appData.classes.length,
                present: selectedDateAttendance.filter(a => a.status === 'present').length,
                late: selectedDateAttendance.filter(a => a.status === 'late').length,
                absent: selectedDateAttendance.filter(a => a.status === 'absent').length,
                sick: selectedDateAttendance.filter(a => a.status === 'sick').length,
                absent_justified: selectedDateAttendance.filter(a => a.status === 'absent_justified').length
            };

            let bestClass = null;
            let bestRate = -1;
            
            appData.classes.forEach(classItem => {
                const classStudents = appData.students.filter(s => s.class_id === classItem.id);
                if (classStudents.length > 0) {
                    const classAttendance = selectedDateAttendance.filter(a => 
                        classStudents.some(s => s.id === a.student_id)
                    );
                    const presentCount = classAttendance.filter(a => a.status === 'present').length;
                    const rate = (presentCount / classStudents.length) * 100;
                    if (rate > bestRate) {
                        bestRate = rate;
                        bestClass = classItem;
                    }
                }
            });

            const yesterday = getYesterdayDate();
            const yesterdayAttendance = getAttendanceForDate(yesterday);
            const yesterdayPresent = yesterdayAttendance.filter(a => a.status === 'present').length;
            const presentComparison = stats.present - yesterdayPresent;

            document.getElementById('page-content').innerHTML = `
                <div class="space-y-6 fade-in">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
                            <p class="text-gray-600">
                                Vue d'overview de l'établissement
                            </p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content">
                            <div class="date-selector">
                                <button onclick="previousDay()" class="date-nav-btn" title="Jour précédent">
                                    <i data-lucide="chevron-left" class="h-4 w-4"></i>
                                </button>
                                <input 
                                    type="date" 
                                    id="dashboard-date-selector" 
                                    value="${currentDashboardDate}"
                                    class="date-input input"
                                    onchange="changeDashboardDate(this.value)"
                                >
                                <button onclick="nextDay()" class="date-nav-btn" title="Jour suivant">
                                    <i data-lucide="chevron-right" class="h-4 w-4"></i>
                                </button>
                                ${!isToday ? `
                                    <button onclick="goToToday()" class="today-btn">
                                        Aujourd'hui
                                    </button>
                                ` : ''}
                            </div>
                            <p class="text-sm text-gray-600 text-center">
                                ${getFormattedDate(currentDashboardDate)}
                                ${isToday ? ' (Aujourd\'hui)' : ''}
                                ${isFerieToday ? ' 🎉 <strong>Jour Férié</strong>' : ''}
                            </p>
                        </div>
                    </div>

                    ${isFerieToday ? `
                        <div class="card bg-yellow-50 border-yellow-200">
                            <div class="card-content">
                                <div class="flex items-center space-x-3">
                                    <i data-lucide="party" class="h-8 w-8 text-yellow-600"></i>
                                    <div>
                                        <h2 class="text-lg font-bold text-yellow-800">Jour Férié</h2>
                                        <p class="text-yellow-700">Aucun marquage automatique aujourd'hui. Les présences doivent être saisies manuellement.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    ${bestClass && bestRate > 0 ? `
                        <div class="card gradient-bg text-white">
                            <div class="card-content">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h2 class="text-xl font-bold">🏆 Meilleure classe</h2>
                                        <p class="text-blue-100">${bestClass.name} - ${bestRate.toFixed(1)}% de présence</p>
                                    </div>
                                    <i data-lucide="trophy" class="h-8 w-8"></i>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="card cursor-pointer" onclick="loadPage('students')">
                            <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 class="text-sm font-medium">Élèves Total</h3>
                                <i data-lucide="users" class="h-4 w-4 text-blue-600"></i>
                            </div>
                            <div class="card-content">
                                <div class="text-2xl font-bold">${stats.totalStudents}</div>
                            </div>
                        </div>

                        <div class="card cursor-pointer" onclick="loadPage('students')">
                            <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 class="text-sm font-medium">Classes</h3>
                                <i data-lucide="school" class="h-4 w-4 text-green-600"></i>
                            </div>
                            <div class="card-content">
                                <div class="text-2xl font-bold">${stats.totalClasses}</div>
                            </div>
                        </div>

                        <div class="card cursor-pointer" onclick="loadPage('attendance')">
                            <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 class="text-sm font-medium">Présents ${isToday ? 'Aujourd\'hui' : ''}</h3>
                                <i data-lucide="check-circle" class="h-4 w-4 text-green-600"></i>
                            </div>
                            <div class="card-content">
                                <div class="text-2xl font-bold">${stats.present}</div>
                                ${!isToday ? `
                                    <p class="text-xs ${presentComparison >= 0 ? 'text-green-600' : 'text-red-600'}">
                                        ${presentComparison > 0 ? '+' : ''}${presentComparison} vs hier
                                    </p>
                                ` : '<p class="text-xs text-gray-400">&nbsp;</p>'}
                            </div>
                        </div>

                        <div class="card cursor-pointer" onclick="loadPage('attendance')">
                            <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 class="text-sm font-medium">Absents ${isToday ? 'Aujourd\'hui' : ''}</h3>
                                <i data-lucide="x-circle" class="h-4 w-4 text-red-600"></i>
                            </div>
                            <div class="card-content">
                                <div class="text-2xl font-bold">${stats.absent}</div>
                                ${stats.absent > appData.settings.alertThreshold ? `
                                    <p class="text-xs text-red-600">⚠️ Au-dessus du seuil</p>
                                ` : '<p class="text-xs text-gray-400">&nbsp;</p>'}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-bold">Classes de l'établissement</h2>
                                <p class="text-sm text-gray-600">Statistiques pour le ${getFormattedDate(currentDashboardDate)}</p>
                            </div>
                            <div class="card-content">
                                <div class="space-y-3">
                                    ${appData.classes.map(classItem => {
                                        const classStudents = appData.students.filter(s => s.class_id === classItem.id);
                                        const classAttendance = selectedDateAttendance.filter(a => 
                                            classStudents.some(s => s.id === a.student_id)
                                        );
                                        const presentCount = classAttendance.filter(a => a.status === 'present').length;
                                        const rate = classStudents.length > 0 ? ((presentCount / classStudents.length) * 100).toFixed(1) : 0;
                                        
                                        return `
                                            <div class="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <h3 class="font-semibold">${classItem.name}</h3>
                                                    <p class="text-sm text-gray-600 capitalize">${classItem.level}</p>
                                                </div>
                                                <div class="text-right">
                                                    <div class="font-semibold">${presentCount}/${classStudents.length}</div>
                                                    <div class="text-sm ${rate >= 80 ? 'text-green-600' : rate >= 60 ? 'text-yellow-600' : 'text-red-600'}">
                                                        ${rate}%
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                     ${appData.classes.length === 0 ? `
                                        <div class="text-center py-4 text-gray-500">
                                            Aucune classe créée.
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-bold">Activité Récente</h2>
                                <p class="text-sm text-gray-600">Présences du ${getFormattedDate(currentDashboardDate)}</p>
                            </div>
                            <div class="card-content">
                                <div class="space-y-3">
                                    ${selectedDateAttendance.slice(0, 5).map(record => {
                                        const student = appData.students.find(s => s.id === record.student_id);
                                        if (!student) return '';
                                        
                                        const time = record.scanned_at ? new Date(record.scanned_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : 'Manuel';
                                        const statusClass = `status-${record.status}`;
                                        
                                        return `
                                            <div class="flex items-center justify-between p-2 cursor-pointer" onclick="showStudentProfile('${student.id}')">
                                                <div class="flex items-center space-x-3">
                                                    <img src="${getSafePhotoUrl(student.photo)}" alt="${student.first_name}" class="w-8 h-8 rounded-full object-cover" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4='">
                                                    <div>
                                                        <p class="font-medium text-sm">${student.first_name} ${student.last_name}</p>
                                                        <p class="text-xs text-gray-600">${time}</p>
                                                    </div>
                                                </div>
                                                <span class="badge ${statusClass} text-xs">${getStatusText(record.status)}</span>
                                            </div>
                                        `;
                                    }).join('')}
                                    
                                    ${selectedDateAttendance.length === 0 ? `
                                        <div class="text-center py-4">
                                            <i data-lucide="calendar" class="h-8 w-8 text-gray-400 mx-auto mb-2"></i>
                                            <p class="text-gray-600">Aucune présence enregistrée</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h2 class="text-xl font-bold flex items-center">
                                <i data-lucide="trophy" class="h-5 w-5 mr-2 text-yellow-500"></i>
                                Meilleurs élèves de l'école
                            </h2>
                            <p class="text-sm text-gray-600">Classés par points accumulés - Taux de réussite</p>
                        </div>
                        <div class="card-content">
                            <div class="space-y-3">
                                ${(() => {
                                    const topStudents = calculateTopStudents(5);
                                    if (topStudents.length === 0) {
                                        return `
                                            <div class="text-center py-8">
                                                <i data-lucide="star" class="h-16 w-16 text-gray-400 mx-auto mb-4"></i>
                                                <p class="text-gray-600">Aucune note enregistrée</p>
                                                <p class="text-sm text-gray-500">Les meilleurs élèves apparaîtront ici</p>
                                            </div>
                                        `;
                                    }
                                    
                                    return topStudents.map((item, index) => {
                                        // NOUVEAU: Utiliser le vrai rang global au lieu de l'index local
                                        const trueRank = item.globalRank || (index + 1);
                                        const rankClass = trueRank === 1 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                        trueRank === 2 ? 'bg-gray-100 text-gray-800 border-gray-200' :
                                                        trueRank === 3 ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                                        'bg-blue-50 text-blue-800 border-blue-200';
                                        
                                        return `
                                            <div class="flex items-center justify-between p-3 border rounded-lg ${rankClass} cursor-pointer hover:shadow-md transition-shadow" onclick="showStudentProfile('${item.student.id}')">
                                                <div class="flex items-center space-x-3">
                                                    <div class="w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                                                        trueRank === 1 ? 'bg-yellow-500 text-white' :
                                                        trueRank === 2 ? 'bg-gray-500 text-white' :
                                                        trueRank === 3 ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                                                    }">
                                                        ${trueRank}
                                                    </div>
                                                    <img src="${getSafePhotoUrl(item.student.photo)}" alt="${item.student.first_name}" class="w-10 h-10 rounded-full object-cover border-2 border-white" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4='">
                                                    <div>
                                                        <h3 class="font-semibold">${item.student.first_name} ${item.student.last_name}</h3>
                                                        <p class="text-sm opacity-75">${item.class} • ${item.gradeCount} note(s)</p>
                                                    </div>
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-lg font-bold">${item.average}%</div>
                                                    <div class="text-sm opacity-75">${item.totalScore} points</div>
                                                    <i data-lucide="chevron-right" class="h-4 w-4 text-gray-400 mt-1"></i>
                                                </div>
                                            </div>
                                        `;
                                    }).join('');
                                })()}
                            </div>
                            
                            ${(() => {
                                const topStudents = calculateTopStudents(5);
                                if (topStudents.length > 0) {
                                    return `
                                        <div class="mt-4 pt-4 border-t border-gray-200">
                                            <button onclick="showFullRanking()" class="btn btn-outline w-full btn-sm">
                                                <i data-lucide="list" class="h-4 w-4 mr-2"></i>
                                                Voir le classement complet                   
                                            </button>
                                        </div>
                                    `;
                                }
                                return '';
                            })()}
                        </div>
                    </div>
                </div>
            `;
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }

        function showFullRanking() {
            const topStudents = calculateTopStudents(50);
            
            document.getElementById('page-content').innerHTML = `
                <div class="space-y-6 fade-in">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div class="flex items-center space-x-4">
                            <button onclick="loadPage('dashboard')" class="btn btn-ghost btn-icon">
                                <i data-lucide="arrow-left" class="h-4 w-4"></i>
                            </button>
                            <div>
                                <h1 class="text-3xl font-bold text-gray-900">Classement des Élèves</h1>
                                <p class="text-gray-600">
                                    Classement par points accumulés dans toutes les matières - Taux de réussite - ${topStudents.length} élève(s)
                                </p>
                            </div>
                        </div>
                        ${!currentMemberContext ? `
                        <button onclick="shareRankingPDF()" class="btn btn-default">
                            <i data-lucide="share-2" class="h-4 w-4 mr-2"></i>
                            Partager le classement
                        </button>
                        ` : ''}
                    </div>

                    <div class="card">
                        <div class="card-content p-0">
                            <div class="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
                                <table class="min-w-full divide-y divide-gray-200 border-collapse">
                                    <thead class="bg-gradient-to-r from-green-600 to-green-700 sticky top-0">
                                        <tr>
                                            <th class="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-green-500" style="width: 60px;">Rang</th>
                                            <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-green-500">Élève</th>
                                            <th class="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-green-500">Classe</th>
                                            <th class="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-green-500">Points</th>
                                            <th class="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-green-500">Moyenne</th>
                                            <th class="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        ${topStudents.map((item, index) => {
                                            const trueRank = item.globalRank || (index + 1);
                                            const rankBg = trueRank === 1 ? 'bg-yellow-50' : trueRank === 2 ? 'bg-gray-50' : trueRank === 3 ? 'bg-orange-50' : 'bg-white';
                                            const rankBadge = trueRank === 1 ? 'bg-yellow-500 text-white' : trueRank === 2 ? 'bg-gray-500 text-white' : trueRank === 3 ? 'bg-orange-500 text-white' : trueRank < 10 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700';
                                            const avgColor = item.average >= 80 ? 'text-green-600' : item.average >= 60 ? 'text-yellow-600' : 'text-red-600';
                                            
                                            return `
                                                <tr class="${rankBg} hover:bg-blue-50 transition-colors border-b border-gray-200 cursor-pointer" onclick="showStudentProfile('${item.student.id}')">
                                                    <td class="px-4 py-4 whitespace-nowrap text-center border-r border-gray-200">
                                                        <div class="w-8 h-8 flex items-center justify-center rounded-full font-bold ${rankBadge} mx-auto">
                                                            ${trueRank}
                                                        </div>
                                                    </td>
                                                    <td class="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                        <div class="flex items-center">
                                                            <div class="flex-shrink-0 h-10 w-10 border-2 border-gray-300 rounded-full overflow-hidden mr-3">
                                                                <img src="${getSafePhotoUrl(item.student.photo)}" alt="${item.student.first_name}" class="w-10 h-10 rounded-full object-cover" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4='">
                                                            </div>
                                                            <div>
                                                                <div class="text-sm font-semibold text-gray-900">${item.student.first_name} ${item.student.last_name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-medium border-r border-gray-200">
                                                        ${item.class || 'Non assigné'}
                                                    </td>
                                                    <td class="px-4 py-4 whitespace-nowrap text-center border-r border-gray-200">
                                                        <div class="text-base font-bold text-blue-600">${item.totalScore}</div>
                                                        <div class="text-xs text-gray-500">points</div>
                                                    </td>
                                                    <td class="px-4 py-4 whitespace-nowrap text-center border-r border-gray-200">
                                                        <div class="text-lg font-bold ${avgColor}">${item.average.toFixed(2)}%</div>
                                                    </td>
                                                    <td class="px-4 py-4 whitespace-nowrap text-center">
                                                        <div class="text-sm font-medium text-gray-700">${item.gradeCount}</div>
                                                        <div class="text-xs text-gray-500">note${item.gradeCount !== 1 ? 's' : ''}</div>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }

        async function shareRankingPDF() {
            try {
                notificationManager.show('⏳ Préparation du PDF...', 'info');
                const topStudents = calculateTopStudents(50);
                
                if (topStudents.length === 0) {
                    notificationManager.show('❌ Aucun élève à classer', 'warning');
                    return;
                }
                
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // En-tête professionnel
                doc.setFontSize(18).setTextColor(40, 40, 40);
                doc.setFont('helvetica', 'bold');
                doc.text('LES MEILLEURS ÉLÈVES DE L\'ÉCOLE', 105, 20, { align: 'center' });
                
                doc.setFontSize(12).setTextColor(100, 100, 100);
                doc.setFont('helvetica', 'normal');
                doc.text(`${appData.schoolSettings.school_name}`, 105, 30, { align: 'center' });
                
                let y = 45;
                
                // Champ signature administration
                doc.setFontSize(10).setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text('Signature Administration:', 20, y);
                doc.setFont('helvetica', 'normal');
                y += 10;
                
                // Date de génération
                doc.setFontSize(9).setTextColor(100, 100, 100);
                doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, y, { align: 'center' });
                y += 10;
                
                // Informations supplémentaires
                doc.setFontSize(10).setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text('Classement par points accumulés dans toutes les matières', 20, y);
                y += 7;
                
                // Tableau professionnel avec autoTable (même style que les notes)
                const tableData = topStudents.map((item, index) => {
                    return [
                        (index + 1).toString(),
                        `${item.student.first_name} ${item.student.last_name}`,
                        item.class || 'Non assigné',
                        `${item.totalScore} pts`,
                        `${item.average.toFixed(2)}%`,
                        `${item.gradeCount} note${item.gradeCount !== 1 ? 's' : ''}`
                    ];
                });

                doc.autoTable({
                    startY: y,
                    head: [['Rang', 'Élève', 'Classe', 'Points', 'Taux de réussite', 'Nombre de notes']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: {
                        fillColor: [37, 99, 235],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        fontSize: 9,
                        halign: 'center'
                    },
                    bodyStyles: {
                        fontSize: 9,
                        textColor: [0, 0, 0],
                        lineColor: [200, 200, 200],
                        lineWidth: 0.1
                    },
                    alternateRowStyles: {
                        fillColor: [245, 247, 250]
                    },
                    columnStyles: {
                        0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
                        1: { cellWidth: 55, halign: 'left' },
                        2: { cellWidth: 35, halign: 'left' },
                        3: { cellWidth: 25, halign: 'center', fontStyle: 'bold', textColor: [37, 99, 235] },
                        4: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
                        5: { cellWidth: 25, halign: 'center' }
                    },
                    margin: { left: 20, right: 20 },
                    styles: {
                        lineColor: [200, 200, 200],
                        lineWidth: 0.1
                    },
                    tableLineColor: [200, 200, 200],
                    tableLineWidth: 0.5
                });

                // Note en bas de page
                const finalY = doc.lastAutoTable.finalY + 10;
                doc.setFontSize(8).setTextColor(150, 150, 150);
                doc.text('Ce classement est basé d\'abord sur le nombre total de points accumulés dans toutes les matières, puis sur le taux de réussite (pourcentage).', 105, finalY, { align: 'center' });
                
                const pdfBlob = doc.output('blob');
                const filename = `Meilleurs_Eleves_${new Date().toISOString().split('T')[0]}.pdf`;
                
                await sharePDFMobile(pdfBlob, filename, 'Les meilleurs élèves de l\'école');
                
            } catch (error) {
                console.error('Erreur partage classement:', error);
                notificationManager.show('❌ Erreur lors du partage du classement', 'error');
            }
        }

        function loadStudentsPage() {
            const organized = organizeClassesByLevel();
            const levels = ['Primaire', 'Collège', 'Lycée'];
            const hasClasses = Object.keys(organized).length > 0;
            
            document.getElementById('page-content').innerHTML = `
                <div class="space-y-6 fade-in">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Gestion des Élèves</h1>
                            <p class="text-gray-600">
                                Gérez les classes et les élèves de l'établissement
                            </p>
                        </div>
                        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                            <button onclick="showModal('add-class-modal')" class="btn btn-outline theme-transition">
                                <i data-lucide="school" class="h-4 w-4 mr-2"></i>
                                Créer une classe
                            </button>
                            <button onclick="showModal('add-student-modal')" class="btn btn-default theme-transition">
                                <i data-lucide="plus" class="h-4 w-4 mr-2"></i>
                                Nouvel Élève
                            </button>
                        </div>
                    </div>

                    ${hasClasses ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${levels.map(level => {
                                const classes = organized[level];
                                if (!classes || classes.length === 0) return '';
                                
                                return `
                                    <div class="space-y-3">
                                        <div class="flex items-center justify-between mb-3">
                                            <h2 class="text-lg font-bold text-gray-800">${level}</h2>
                                            <span class="text-sm text-gray-500">${classes.length} classe${classes.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div class="space-y-3">
                                            ${classes.map((classItem, index) => {
                                                const students = appData.students.filter(s => s.class_id === classItem.id);
                                                const isFirst = index === 0;
                                                const isLast = index === classes.length - 1;
                                                
                                                return `
                                                    <div class="card theme-transition relative group">
                                                        <div class="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                            ${!isFirst ? `
                                                                <button onclick="event.stopPropagation(); reorderClass('${classItem.id}', 'up', '${level}')" 
                                                                        class="btn btn-ghost btn-sm p-1 h-6 w-6" title="Monter">
                                                                    <i data-lucide="chevron-up" class="h-3 w-3"></i>
                                                                </button>
                                                            ` : ''}
                                                            ${!isLast ? `
                                                                <button onclick="event.stopPropagation(); reorderClass('${classItem.id}', 'down', '${level}')" 
                                                                        class="btn btn-ghost btn-sm p-1 h-6 w-6" title="Descendre">
                                                                    <i data-lucide="chevron-down" class="h-3 w-3"></i>
                                                                </button>
                                                            ` : ''}
                                                        </div>
                                                        <div>
                                                            <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
                                                                <h3 class="text-xl font-bold">${classItem.name}</h3>
                                                            </div>
                                                            <div class="card-content">
                                                                <div class="flex items-center space-x-2 text-gray-600 mb-4">
                                                                    <i data-lucide="users" class="h-4 w-4"></i>
                                                                    <span>${students.length} élève${students.length !== 1 ? 's' : ''}</span>
                                                                </div>
                                                                <div class="space-y-2">
                                                                    ${students.length > 0 ? students.slice(0, 3).map(student => `
                                                                        <div class="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-blue-50" onclick="showStudentProfile('${student.id}')">
                                                                            <div class="flex items-center space-x-2">
                                                                                <img src="${getSafePhotoUrl(student.photo)}" alt="${student.first_name}" class="w-8 h-8 rounded-full object-cover" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4='">
                                                                                <span class="text-sm font-medium">${student.first_name} ${student.last_name}</span>
                                                                            </div>
                                                                            <i data-lucide="chevron-right" class="h-4 w-4 text-gray-400"></i>
                                                                        </div>
                                                                    `).join('') : ''}
                                                                    ${students.length > 0 ? `
                                                                        <button onclick="showAllStudentsInClass('${classItem.id}', '${classItem.name}')" class="w-full mt-2 btn btn-outline btn-sm">
                                                                            <i data-lucide="users" class="h-4 w-4 mr-2"></i>
                                                                            ${students.length > 3 ? `Voir tous les élèves (${students.length})` : students.length === 1 ? 'Voir l\'élève' : `Voir tous les élèves (${students.length})`}
                                                                        </button>
                                                                    ` : `
                                                                        <div class="text-center text-sm text-gray-500 py-2">
                                                                            Aucun élève.
                                                                        </div>
                                                                    `}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-12">
                            <i data-lucide="school" class="h-16 w-16 text-gray-400 mx-auto mb-4"></i>
                            <h3 class="text-lg font-semibold mb-2">Aucune classe pour le moment</h3>
                            <p class="text-gray-600 mb-4">Créez une classe pour commencer à ajouter des élèves.</p>
                        </div>
                    `}
                </div>
            `;
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }

        // Fonction pour afficher tous les élèves d'une classe
        function showAllStudentsInClass(classId, className) {
            const students = appData.students.filter(s => s.class_id === classId);
            
            document.getElementById('page-content').innerHTML = `
                <div class="space-y-6 fade-in">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div class="flex items-center space-x-4">
                            <button onclick="loadPage('students')" class="btn btn-ghost btn-icon">
                                <i data-lucide="arrow-left" class="h-4 w-4"></i>
                            </button>
                            <div>
                                <h1 class="text-3xl font-bold text-gray-900">${className}</h1>
                                <p class="text-gray-600">
                                    ${students.length} élève${students.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content">
                            <div class="space-y-2">
                                ${students.length > 0 ? students.map(student => `
                                    <div class="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors" onclick="showStudentProfile('${student.id}')">
                                        <div class="flex items-center space-x-3">
                                            <img src="${getSafePhotoUrl(student.photo)}" alt="${student.first_name}" class="w-12 h-12 rounded-full object-cover border-2 border-white" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4='">
                                            <div>
                                                <h3 class="font-semibold text-lg">${student.first_name} ${student.last_name}</h3>
                                               <p class="text-sm text-gray-600">Matricule: ${student.matricule || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <i data-lucide="chevron-right" class="h-5 w-5 text-gray-400"></i>
                                    </div>
                                `).join('') : `
                                    <div class="text-center py-8">
                                        <i data-lucide="users" class="h-16 w-16 text-gray-400 mx-auto mb-4"></i>
                                        <p class="text-gray-600">Aucun élève dans cette classe</p>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            lucide.createIcons();
        }

        function loadAttendancePage() {
            const today = new Date().toISOString().split('T')[0];
            const todayAttendance = getAttendanceForDate(today);
            const studentsWithoutAttendance = appData.students.filter(
                student => !todayAttendance.some(att => att.student_id === student.id)
            );

            const isFerieToday = isFerie();

            document.getElementById('page-content').innerHTML = `
                <div class="space-y-6 fade-in">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Gestion des Présences</h1>
                            <p class="text-gray-600">
                                Marquez les présences pour aujourd'hui (${new Date().toLocaleDateString('fr-FR')})
                                ${isFerieToday ? ' 🎉 <strong>Jour Férié</strong>' : ''}
                            </p>
                        </div>
                        <div class="w-full md:w-auto">
                            <button onclick="startScanner()" class="btn btn-default w-full md:w-auto theme-transition">
                                <i data-lucide="camera" class="h-4 w-4 mr-2"></i>
                                Scanner un élève
                            </button>
                        </div>
                    </div>

                    ${isFerieToday ? `
                        <div class="card bg-yellow-50 border-yellow-200">
                            <div class="card-content">
                                <div class="flex items-center space-x-3">
                                    <i data-lucide="party" class="h-6 w-6 text-yellow-600"></i>
                                    <div>
                                        <h2 class="text-lg font-bold text-yellow-800">Jour Férié</h2>
                                        <p class="text-yellow-700">Aucun marquage automatique aujourd'hui. Toutes les présences doivent être saisies manuellement.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="card">
                        <div class="card-content">
                            <div class="relative">
                                <i data-lucide="search" class="absolute left-3 top-3 h-4 w-4 text-gray-400"></i>
                                <input 
                                    type="text" 
                                    id="attendance-search" 
                                    placeholder="Rechercher un élève par nom..." 
                                    class="input pl-9"
                                    oninput="filterStudentsList(this.value)"
                                >
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="card">
                            <div class="card-content p-4">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-full bg-green-100 text-green-800">
                                        <i data-lucide="check" class="h-4 w-4"></i>
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold">${todayAttendance.filter(a => a.status === 'present').length}</p>
                                        <p class="text-sm text-gray-600">Présents</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-content p-4">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-full bg-yellow-100 text-yellow-800">
                                        <i data-lucide="clock" class="h-4 w-4"></i>
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold">${todayAttendance.filter(a => a.status === 'late').length}</p>
                                        <p class="text-sm text-gray-600">En retard</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-content p-4">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-full bg-purple-100 text-purple-800">
                                        <i data-lucide="heart" class="h-4 w-4"></i>
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold">${todayAttendance.filter(a => a.status === 'sick' || (a.status === 'absent_justified' && a.note && a.note.toLowerCase().includes('malade'))).length}</p>
                                        <p class="text-sm text-gray-600">Malades</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-content p-4">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-full bg-red-100 text-red-800">
                                        <i data-lucide="x" class="h-4 w-4"></i>
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold">${todayAttendance.filter(a => a.status === 'absent').length}</p>
                                        <p class="text-sm text-gray-600">Absents</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="card">
                            <div class="card-header">
                                <h2 id="students-to-mark-header" class="text-xl font-bold">Élèves à marquer (${studentsWithoutAttendance.length})</h2>
                            </div>
                            <div class="card-content">
                                <div class="space-y-3" id="students-to-mark-list">
                                    ${studentsWithoutAttendance.map(student => {
                                        const classItem = appData.classes.find(c => c.id === student.class_id);
                                        return `
                                            <div class="student-item flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-2">
                                                <div class="flex items-center space-x-3 cursor-pointer" onclick="showStudentProfile('${student.id}')">
<img src="${getSafePhotoUrl(student.photo)}" alt="${student.first_name}" class="w-10 h-10 rounded-full object-cover" onerror="this.style.display='none'">
                                                    <div>
                                                        <h3 class="font-semibold student-name">${student.first_name} ${student.last_name}</h3>
                                                        <p class="text-sm text-gray-600 student-class">${classItem?.name || 'Non assigné'}</p>
                                                    </div>
                                                </div>
                                                <div class="flex flex-wrap gap-2">
                                                    <button onclick="markAttendance('${student.id}', 'present')" class="btn btn-outline btn-sm text-green-600 border-green-200 hover:bg-green-50">
                                                        <i data-lucide="check" class="h-4 w-4 mr-1"></i>
                                                        Présent
                                                    </button>
                                                    <button onclick="markAttendance('${student.id}', 'late')" class="btn btn-outline btn-sm text-yellow-600 border-yellow-200 hover:bg-yellow-50">
                                                        <i data-lucide="clock" class="h-4 w-4 mr-1"></i>
                                                        Retard
                                                    </button>
                                                    <button onclick="markAttendance('${student.id}', 'sick')" class="btn btn-outline btn-sm text-purple-600 border-purple-200 hover:bg-purple-50">
                                                        <i data-lucide="heart" class="h-4 w-4 mr-1"></i>
                                                        Malade
                                                    </button>
                                                    <button onclick="markAttendance('${student.id}', 'absent')" class="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50">
                                                        <i data-lucide="x" class="h-4 w-4 mr-1"></i>
                                                        Absent
                                                    </button>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                    
                                    ${studentsWithoutAttendance.length === 0 ? `
                                        <div class="text-center py-8">
                                            <i data-lucide="check-circle" class="h-12 w-12 text-green-500 mx-auto mb-4"></i>
                                            <h3 class="text-lg font-semibold mb-2">Tous les élèves sont marqués !</h3>
                                            <p class="text-gray-600">Tous les élèves ont été marqués pour aujourd'hui.</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-bold">Élèves déjà marqués</h2>
                            </div>
                            <div class="card-content">
                                <div class="space-y-3">
                                    ${todayAttendance.map(record => {
                                        const student = appData.students.find(s => s.id === record.student_id);
                                        if (!student) return '';
                                        
                                        const classItem = appData.classes.find(c => c.id === student.class_id);
                                        const statusClass = `status-${record.status}`;
                                        const time = record.scanned_at ? new Date(record.scanned_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : 'Manuel';
                                        
                                        const justification = appData.absenceJustifications.find(j => j.attendance_id === record.id);
                                        
                                        return `
                                            <div class="flex items-center justify-between p-3 border rounded-lg">
                                                <div class="flex items-center space-x-3 cursor-pointer" onclick="showStudentProfile('${student.id}')">
                                                    <img src="${getSafePhotoUrl(student.photo)}" alt="${student.first_name}" class="w-10 h-10 rounded-full object-cover" onerror="this.style.display='none'">
                                                    <div>
                                                        <h3 class="font-semibold">${student.first_name} ${student.last_name}</h3>
                                                        <p class="text-sm text-gray-600">${classItem?.name} • ${time}</p>
                                                        ${justification ? `
                                                            <p class="text-xs text-blue-600">
                                                                ${justification.justification_type === 'sick' ? '🩺 Maladie justifiée' : '📋 Absence justifiée'}
                                                                ${justification.justification_note ? `: ${justification.justification_note}` : ''}
                                                            </p>
                                                        ` : ''}
                                                    </div>
                                                </div>
                                               <div class="flex items-center space-x-2">
                                                <span class="badge ${statusClass}">${getStatusText(record.status)}</span>

                                                <button onclick="showEditAttendanceModal('${record.id}')" class="btn btn-ghost btn-sm text-blue-600">
                                                    <i data-lucide="edit" class="h-4 w-4"></i>
                                                </button>

                                                ${record.status === 'absent' ? `
                                                    <button onclick="justifyAbsence('${record.id}', '${student.first_name} ${student.last_name}', '${record.date}', '${student.id}')" class="btn btn-ghost btn-sm text-purple-600">
                                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                                        </button>
                                                    ` : ''}
                                                    ${justification && justification.proof_image_url ? `
                                                        <button onclick="showProofImage('${justification.proof_image_url}', '${student.first_name} ${student.last_name} - ${getStatusText(record.status)}')" class="btn btn-ghost btn-sm text-blue-600">
                                                            <i data-lucide="image" class="h-4 w-4"></i>
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function filterStudentsList(searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            const studentItems = document.querySelectorAll('#students-to-mark-list .student-item');
            let visibleCount = 0;

            studentItems.forEach(item => {
                const studentName = item.querySelector('.student-name').textContent.toLowerCase();
                const studentClass = item.querySelector('.student-class').textContent.toLowerCase();
                
                const isVisible = studentName.includes(term) || studentClass.includes(term);
                item.style.display = isVisible ? 'flex' : 'none';
                if (isVisible) {
                    visibleCount++;
                }
            });

            const header = document.getElementById('students-to-mark-header');
            if (header) {
                const total = document.querySelectorAll('#students-to-mark-list .student-item').length;
                header.textContent = `Élèves à marquer (${term ? `${visibleCount} sur ` : ''}${total})`;
            }
        }

        function loadHistoryPage() {
            const allAttendance = [...appData.attendance].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            
            document.getElementById('page-content').innerHTML = `
                <div class="space-y-6 fade-in">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Historique des Présences</h1>
                            <p class="text-gray-600">
                                Consultez l'historique complet des présences
                            </p>
                        </div>
                        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                            <button onclick="showShareClassProfilesModal()" class="btn btn-outline theme-transition">
                                <i data-lucide="users" class="h-4 w-4 mr-2"></i>
                                Partager Profils Classe
                            </button>
                            <button onclick="shareHistoryToPDFAsync()" class="btn btn-default theme-transition">
                                <i data-lucide="share-2" class="h-4 w-4 mr-2"></i>
                                Partager Historique
                            </button>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-content">
                            <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                <div class="flex-1">
                                    <div class="relative">
                                        <i data-lucide="search" class="absolute left-3 top-3 h-4 w-4 text-gray-400"></i>
                                        <input type="text" id="history-search" placeholder="Rechercher un élève..." class="input pl-9" oninput="filterHistory()">
                                    </div>
                                </div>
                                <select id="history-class-filter" class="select-trigger" onchange="filterHistory()">
                                    <option value="">Toutes les classes</option>
                                    ${appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                </select>
                                <select id="history-status-filter" class="select-trigger" onchange="filterHistory()">
                                    <option value="">Tous les statuts</option>
                                    <option value="present">Présent</option>
                                    <option value="late">En retard</option>
                                    <option value="sick">Malade</option>
                                    <option value="absent">Absent</option>
                                    <option value="absent_justified">Absence justifiée</option>
                                </select>
                                <input type="date" id="history-date-filter" class="input" onchange="filterHistory()">
                            </div>

                            <div class="space-y-3" id="history-results">
                                ${renderHistoryResults(allAttendance)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderHistoryResults(records) {
            if (records.length === 0) {
                return '<p class="text-center text-gray-600 py-8">Aucun enregistrement trouvé</p>';
            }

            return records.map(record => {
                const student = appData.students.find(s => s.id === record.student_id);
                if (!student) return '';
                
                const classItem = appData.classes.find(c => c.id === student.class_id);
                const statusClass = `status-${record.status}`;
                const time = record.scanned_at ? new Date(record.scanned_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : 'Manuel';
                
                const justification = appData.absenceJustifications.find(j => j.attendance_id === record.id);
                
                return `
                    <div class="history-item flex items-center justify-between p-3 border rounded-lg"
                         data-student-name="${student.first_name} ${student.last_name}"
                         data-class-id="${student.class_id}"
                         data-status="${record.status}"
                         data-date="${record.date}">
                        <div class="flex items-center space-x-3 cursor-pointer" onclick="showStudentProfile('${student.id}')">
                            <img src="${getSafePhotoUrl(student.photo)}" alt="${student.first_name}" class="w-10 h-10 rounded-full object-cover" onerror="this.style.display='none'">
                            <div>
                                <h3 class="font-semibold">${student.first_name} ${student.last_name}</h3>
                                <p class="text-sm text-gray-600">
                                    ${classItem?.name} • 
                                    ${new Date(record.date).toLocaleDateString('fr-FR')} • 
                                    ${time}
                                    ${record.note ? ` • ${record.note}` : ''}
                                </p>
                                ${justification ? `
                                    <div class="mt-1">
                                        <p class="text-xs text-blue-600">
                                            ${justification.justification_type === 'sick' ? '🩺 Maladie justifiée' : '📋 Absence justifiée'}
                                            ${justification.justification_note ? `: ${justification.justification_note}` : ''}
                                        </p>
                                        ${justification.proof_image_url ? `
                                            <button onclick="event.stopPropagation(); showProofImage('${justification.proof_image_url}', '${student.first_name} ${student.last_name} - ${getStatusText(record.status)}')" class="text-xs text-blue-500 underline mt-1">
                                                Voir la preuve
                                            </button>
                                        ` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                       <div class="flex items-center space-x-2">
                        <span class="badge ${statusClass}">${getStatusText(record.status)}</span>

                        <button onclick="showEditAttendanceModal('${record.id}')" class="btn btn-ghost btn-sm text-blue-600">
                            <i data-lucide="edit" class="h-4 w-4"></i>
                        </button>

                        ${record.status === 'absent' ? `
                            <button onclick="event.stopPropagation(); justifyAbsence('${record.id}', '${student.first_name} ${student.last_name}', '${record.date}', '${student.id}')" class="btn btn-ghost btn-sm text-purple-600">
                                    <i data-lucide="edit" class="h-4 w-4"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }

        function filterHistory() {
            const searchTerm = document.getElementById('history-search').value.toLowerCase();
            const classFilter = document.getElementById('history-class-filter').value;
            const statusFilter = document.getElementById('history-status-filter').value;
            const dateFilter = document.getElementById('history-date-filter').value;

            const items = document.querySelectorAll('.history-item');
            
            items.forEach(item => {
                const studentName = item.dataset.studentName.toLowerCase();
                const classId = item.dataset.classId;
                const status = item.dataset.status;
                const date = item.dataset.date;

                const matchesSearch = !searchTerm || studentName.includes(searchTerm);
                const matchesClass = !classFilter || classId === classFilter;
                const matchesStatus = !statusFilter || status === statusFilter;
                const matchesDate = !dateFilter || date === dateFilter;

                item.style.display = (matchesSearch && matchesClass && matchesStatus && matchesDate) ? 'flex' : 'none';
            });
        }

        function loadSettingsPage() {
            const formattedFeries = getFormattedFeries();
            
            document.getElementById('page-content').innerHTML = `
                <div class="space-y-6 fade-in">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Paramètres</h1>
                        <p class="text-gray-600">
                            Gérez les paramètres de l'application
                        </p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-bold">Paramètres Généraux</h2>
                            </div>
                            <div class="card-content space-y-4">
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Nom de l'application</label>
                                    <input type="text" id="setting-app-name" value="${appData.settings.appName}" class="input">
                                </div>

                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Seuil d'alerte d'absence</label>
                                    <input type="number" id="setting-alert-threshold" value="${appData.settings.alertThreshold}" class="input" min="1" max="50">
                                    <p class="text-sm text-gray-600">
                                        Alerte si le nombre d'absents dépasse ce seuil
                                    </p>
                                </div>
                                

                                <div class="config-section">
                                    <h3>Heures de Présence</h3>
                                    <div class="time-input-group">
                                        <div class="time-input">
                                            <label>Présent jusqu'à</label>
                                            <input type="time" id="setting-present-until" value="${appData.settings.attendanceTimes.presentUntil}" class="input">
                                        </div>
                                        <div class="time-input">
                                            <label>En retard jusqu'à</label>
                                            <input type="time" id="setting-late-until" value="${appData.settings.attendanceTimes.lateUntil}" class="input">
                                        </div>
                                    </div>
                                     <div class="time-input mt-4">
                                            <label>Absent automatiquement après</label>
                                            <input type="time" id="setting-auto-absent-after" value="${appData.settings.attendanceTimes.autoAbsentAfter}" class="input">
                                    </div>
                                    <p class="text-sm text-gray-600 mt-2">
                                        Configurez les heures pour les statuts automatiques.
                                    </p>
                                </div>

                                <button onclick="saveAppSettings()" class="btn btn-default w-full theme-transition">
                                    <i data-lucide="save" class="h-4 w-4 mr-2"></i>
                                    Sauvegarder les paramètres
                                </button>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-bold">Paramètres de l'École</h2>
                            </div>
                            <div class="card-content space-y-4">
                                <!-- Option pour envoyer un message à tous les parents -->
                                <div class="space-y-2">
                                    <label class="text-sm font-medium">Message à tous les parents</label>
                                    <textarea id="message-to-all-parents" class="input" rows="4" placeholder="Écrivez un message qui sera envoyé dans le carnet de liaison de tous les élèves..."></textarea>
                                    <button onclick="sendMessageToAllParents()" class="btn btn-default w-full theme-transition">
                                        <i data-lucide="send" class="h-4 w-4 mr-2"></i>
                                        Envoyer le message
                                    </button>
                                    <p class="text-sm text-gray-600">
                                        Ce message sera automatiquement ajouté dans le carnet de liaison de tous les élèves, visible par tous les parents.
                                    </p>
                                </div>

                                <div class="config-section">
                                    <h3>Jours Fériés</h3>
                                    <div class="space-y-3">
                                        <div class="flex space-x-2">
                                            <input type="date" id="new-ferie-date" class="input flex-1">
                                            <button onclick="addNewFerie()" class="btn btn-outline">
                                                <i data-lucide="plus" class="h-4 w-4 mr-2"></i>
                                                Ajouter
                                            </button>
                                        </div>
                                        
                                        <div id="feries-list" class="max-h-48 overflow-y-auto">
                                            ${formattedFeries.length > 0 ? 
                                                formattedFeries.map(ferie => `
                                                    <div class="ferie-item">
                                                        <span class="ferie-date">${ferie.formatted}</span>
                                                        <div class="ferie-actions">
                                                            <button onclick="removeFerie('${ferie.date}')" class="btn btn-ghost btn-sm text-red-600">
                                                                <i data-lucide="trash-2" class="h-4 w-4"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                `).join('') 
                                                : `
                                                <div class="empty-state">
                                                    <i data-lucide="calendar" class="h-8 w-8 text-gray-400 mx-auto mb-2"></i>
                                                    <p class="text-gray-600">Aucun jour férié configuré</p>
                                                </div>
                                            `}
                                        </div>
                                        <p class="text-sm text-gray-600">
                                            Le scan reste manuel les jours fériés.
                                        </p>
                                    </div>
                                </div>

                                <button onclick="saveSchoolSettings()" class="btn btn-default w-full theme-transition">
                                    <i data-lucide="save" class="h-4 w-4 mr-2"></i>
                                    Sauvegarder les paramètres de l'école
                                </button>
                            </div>
                        </div>

                        <div class="card border-red-200 lg:col-span-2">
                            <div class="card-header">
                                <h2 class="text-xl font-bold text-red-600 flex items-center">
                                    <i data-lucide="alert-triangle" class="h-5 w-5 mr-2"></i>
                                    Zone de Danger
                                </h2>
                            </div>
                            <div class="card-content">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button onclick="showDeleteStudentModal()" class="btn btn-destructive theme-transition">
                                        <i data-lucide="trash-2" class="h-4 w-4 mr-2"></i>
                                        Supprimer un Élève
                                    </button>
                                    <button onclick="showDeleteClassModal()" class="btn btn-destructive theme-transition">
                                        <i data-lucide="trash-2" class="h-4 w-4 mr-2"></i>
                                        Supprimer une Classe
                                    </button>
                                </div>
                                <p class="text-sm text-gray-600 mt-4">
                                    ⚠️ Attention: Ces actions sont irréversibles. La suppression d'un élève ou d'une classe effacera définitivement toutes les données associées.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    function getMemberFormHTML() {
    return `
        <form id="add-member-form" class="space-y-4" onsubmit="handleAddMember(event)">
            <div>
                <label class="text-sm font-medium">Email</label>
                <input id="member-email" type="email" class="input">
            </div>
            <div>
                <label class="text-sm font-medium">Mot de passe</label>
                <div class="relative">
                    <input 
                        id="member-password" 
                        type="password" 
                        class="input pr-10" >
                    <button 
                        type="button" 
                        id="member-eye-icon"
                        onclick="togglePasswordVisibility('member-password', 'member-eye-icon-lucide')"
                        class="btn btn-ghost btn-icon absolute top-1/2 right-1 -translate-y-1/2" 
                    >
                        <i id="member-eye-icon-lucide" data-lucide="eye" class="h-4 w-4"></i>
                    </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">Le mot de passe est stocké localement (ne pas utiliser pour comptes sensibles).</p>
            </div>
            <div>
                <label class="text-sm font-medium">Rôle</label>
                <select id="member-role" class="select-trigger" required onchange="toggleAssignmentSection()">
                    <option value="">Sélectionner un rôle</option>
                    <option value="proffesseur">proffesseur</option>
                    <option value="parent">parent</option>
                    <option value="gardiant">gardiant</option>
                </select>
            </div>

            <div id="assignment-section" class="hidden space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 class="text-sm font-medium text-gray-700">Assignation (Optionnel)</h3>
                <div id="assignment-for-teacher" class="hidden space-y-4">
                    <p class="text-xs text-gray-600">Assignez des classes entières et/ou des matières spécifiques au professeur.</p>
                    <div>
                        <label class="text-sm font-medium mb-1 block">Classes Assignées</label>
                        <div class="relative mb-2"><i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"></i><input type="text" id="teacher-class-search" class="input pl-9" placeholder="Rechercher une classe..."></div>
                        <div class="flex justify-end items-center mb-2"><button type="button" id="select-all-classes" class="text-xs text-blue-600 hover:underline">Tout cocher / décocher</button></div>
                        <div id="assignment-classes-list" class="max-h-40 overflow-y-auto border rounded-lg bg-white p-2"></div>
                    </div>
                    <div>
                        <label class="text-sm font-medium mb-1 block">Matières Spécifiques (en plus des classes)</label>
                        <div class="relative mb-2"><i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"></i><input type="text" id="teacher-subject-search" class="input pl-9" placeholder="Rechercher une matière..."></div>
                        <div class="flex justify-end items-center mb-2"><button type="button" id="select-all-subjects" class="text-xs text-blue-600 hover:underline">Tout cocher / décocher</button></div>
                        <div id="assignment-subjects-list" class="max-h-40 overflow-y-auto border rounded-lg bg-white p-2"></div>
                    </div>
                </div>
                <div id="assignment-for-parent" class="hidden space-y-2">
                    <p class="text-xs text-gray-600">Le parent n'aura accès qu'aux informations des élèves que vous cochez.</p>
                    <div class="relative mb-2">
                        <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"></i>
                        <input type="text" id="parent-student-search" class="input pl-9" placeholder="Rechercher un élève...">
                    </div>
                    <div>
                        <div class="flex justify-between items-center mb-2"><label class="text-sm font-medium">Élèves à assigner</label><button type="button" id="select-all-students" class="text-xs text-blue-600 hover:underline">Tout cocher / décocher</button></div>
                        <div id="assignment-students-list" class="max-h-48 overflow-y-auto border rounded-lg bg-white p-2"></div>
                    </div>
                </div>
                <div class="text-xs text-gray-600 text-center bg-white p-2 rounded-md"><span id="assignment-summary">Sélectionnez un rôle pour commencer l'assignation.</span></div>
                <button type="button" onclick="clearAssignments()" class="btn btn-outline btn-sm w-full"><i data-lucide="trash-2" class="h-4 w-4 mr-2"></i>Effacer les sélections</button>
            </div>

            <div class="flex space-x-2">
                <button type="submit" class="btn btn-default flex-1">Ajouter</button>
                <button type="button" onclick="showAddMemberForm(false)" class="btn btn-outline flex-1">Annuler</button>
            </div>
        </form>
    `;
}

function loadAccountsPage() {
    const teachers = appData.members.filter(m => m.role === 'proffesseur');
    const parents = appData.members.filter(m => m.role === 'parent');
    const guardians = appData.members.filter(m => m.role === 'gardiant');

    document.getElementById('page-content').innerHTML = `
        <div class="space-y-6 fade-in">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Gestion des Comptes</h1>
                    <p class="text-gray-600">Ajoutez et gérez les accès pour les professeurs, parents et gardiens.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div class="card lg:sticky lg:top-6">
                     <div class="card-header">
                        <h2 class="text-xl font-bold">Ajouter un membre</h2>
                    </div>
                    <div class="card-content">
                        <p class="text-sm text-gray-600 mb-4">Cliquez sur le bouton pour afficher le formulaire d'ajout.</p>
                        <button onclick="showAddMemberForm(true)" class="btn btn-default w-full mb-4">
                            <i data-lucide="user-plus" class="h-4 w-4 mr-2"></i>
                            Ajouter un membre
                        </button>
                        <div id="add-member-form-container" class="hidden">
                           ${getMemberFormHTML()}
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="text-xl font-bold">Professeurs <span class="text-lg font-semibold text-blue-600">(${teachers.length})</span></h2>
                        </div>
                        <div class="card-content">
                            <div class="overflow-x-auto">
                                <table class="min-w-full">
                                    <tbody class="divide-y divide-gray-200">
                                        ${teachers.length > 0 ? teachers.map(createMemberTableRowHTML).join('') : '<tr><td colspan="2" class="text-center text-gray-500 py-4">Aucun professeur</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h2 class="text-xl font-bold">Parents <span class="text-lg font-semibold text-blue-600">(${parents.length})</span></h2>
                        </div>
                        <div class="card-content">
                            <div class="overflow-x-auto">
                                <table class="min-w-full">
                                    <tbody class="divide-y divide-gray-200">
                                        ${parents.length > 0 ? parents.map(createMemberTableRowHTML).join('') : '<tr><td colspan="2" class="text-center text-gray-500 py-4">Aucun parent</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h2 class="text-xl font-bold">Gardiens <span class="text-lg font-semibold text-blue-600">(${guardians.length})</span></h2>
                        </div>
                        <div class="card-content">
                            <div class="overflow-x-auto">
                                <table class="min-w-full">
                                    <tbody class="divide-y divide-gray-200">
                                        ${guardians.length > 0 ? guardians.map(createMemberTableRowHTML).join('') : '<tr><td colspan="2" class="text-center text-gray-500 py-4">Aucun gardien</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const form = document.getElementById('add-member-form');
    if (form) {
      form.onsubmit = handleAddMember;
    }
    
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function saveMembers() {
    if (!currentUser) return;
    try {
        const key = `members_${currentUser.id}`;
        localStorage.setItem(key, JSON.stringify(appData.members || []));
    } catch (e) {
        console.error('Erreur sauvegarde members:', e);
    }
}

function loadMembers() {
    if (!currentUser) {
        // Demande différée : on chargera après connexion
        return;
    }
    try {
        const key = `members_${currentUser.id}`;
        const saved = localStorage.getItem(key);
        appData.members = saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Erreur chargement members:', e);
        appData.members = [];
    }
}

async function loadMembersFromSupabase() {
    if (!currentUser) return;
    try {
        const ownerId = currentUser.id;
        const { data, error } = await supabase.from('members').select('*').eq('owner_user_id', ownerId).order('created_at', { ascending: true });
        if (error) throw error;
        appData.members = data || [];
    } catch (err) {
        console.error('Erreur chargement members supabase:', err);
        appData.members = [];
    }
}

function createMemberTableRowHTML(member) {
    let assignmentsText = 'Aucune assignation';

    if (member.role === 'parent' && member.assigned_student_ids?.length > 0) {
        assignmentsText = `${member.assigned_student_ids.length} élève(s)`;
    } else if (member.role === 'proffesseur') {
        const classCount = member.assigned_class_ids?.length || 0;
        const subjectCount = member.assigned_subject_ids?.length || 0;
        if (classCount > 0 || subjectCount > 0) {
            assignmentsText = `${classCount} classe(s), ${subjectCount} matière(s)`;
        }
    }
    
    return `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3">
                <div class="text-sm font-semibold text-gray-900">${member.email}</div>
                <div class="text-xs text-gray-600">Assignations: ${assignmentsText}</div>
            </td>
            <td class="px-4 py-3 text-right">
                <div class="flex justify-end space-x-2">
                    <button onclick="showEditMemberForm('${member.id}')" class="btn btn-outline btn-sm btn-icon" title="Modifier">
                        <i data-lucide="edit" class="h-4 w-4"></i>
                    </button>
                    <button onclick="confirmDeleteMember('${member.id}')" class="btn btn-destructive btn-sm btn-icon" title="Supprimer">
                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Affiche ou cache le formulaire d'ajout/modification de membre.
 */function showAddMemberForm(show = true) {
    const container = document.getElementById('add-member-form-container');
            if (!container) return;

            if (show) {
                container.classList.remove('hidden');
                const formCard = container.closest('.card');
                const form = document.getElementById('add-member-form');

                // *** CORRECTION : On réactive la validation pour l'ajout ***
                form.novalidate = false; 

                if (form && formCard) {
                    formCard.querySelector('h2.text-xl').textContent = 'Ajouter un membre';
                    form.querySelector('button[type="submit"]').innerHTML = 'Ajouter';
                    
                    document.getElementById('member-email').disabled = false;
                    document.getElementById('member-role').disabled = false;
                    document.getElementById('member-password').parentElement.style.display = 'block';
                    form.reset();

                    clearAssignments();
                    document.getElementById('assignment-section').classList.add('hidden');

                    form.onsubmit = handleAddMember; 
                    
                    if (window.lucide && typeof window.lucide.createIcons === 'function') {
                        window.lucide.createIcons();
                    }
                    setTimeout(() => document.getElementById('member-email').focus(), 50);
                }
            } else {
                container.classList.add('hidden');
            }
        }
/**
 * Affiche le formulaire pré-rempli pour modifier un membre.
 * 
 */ function showEditMemberForm(memberId) {
    const memberToEdit = appData.members.find(m => m.id === memberId);
            if (!memberToEdit) {
                notificationManager.show('❌ Erreur: Membre introuvable.', 'error');
                return;
            }

            showAddMemberForm(true);
            
            const formCard = document.querySelector('#add-member-form-container').closest('.card');
            const form = document.getElementById('add-member-form');
            if (!form || !formCard) return;

            // *** CORRECTION : On désactive la validation pour la modification ***
            form.novalidate = true; 

            formCard.querySelector('h2.text-xl').textContent = 'Modifier un membre';
            form.querySelector('button[type="submit"]').innerHTML = '<i data-lucide="save" class="h-4 w-4 mr-2"></i> Sauvegarder';

            document.getElementById('member-email').value = memberToEdit.email;
            document.getElementById('member-role').value = memberToEdit.role;
            document.getElementById('member-email').disabled = true;
            document.getElementById('member-role').disabled = true;
            document.getElementById('member-password').parentElement.style.display = 'none';

            clearAssignments();
            currentAssignments.classIds = new Set(memberToEdit.assigned_class_ids || []);
            currentAssignments.subjectIds = new Set(memberToEdit.assigned_subject_ids || []);
            currentAssignments.studentIds = new Set(memberToEdit.assigned_student_ids || []);
            toggleAssignmentSection();

            form.onsubmit = (event) => {
                event.preventDefault();
                handleEditMember(memberId);
            };
            
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }
/**
 * Demande la confirmation avant d'appeler la fonction de suppression.
 */
function confirmDeleteMember(memberId) {
    if (!memberId) return;
    
    // Stocker le memberId pour la confirmation
    pendingDeleteMemberId = memberId;
    
    // Trouver le membre pour afficher ses informations dans la modale
    const member = appData.members.find(m => m.id === memberId);
    const memberEmail = member ? member.email : 'ce membre';
    
    // Traduire le rôle en français
    const roleTranslations = {
        'proffesseur': 'Professeur',
        'parent': 'Parent',
        'gardiant': 'Gardien',
        'admin': 'Administrateur'
    };
    const memberRole = member ? (roleTranslations[member.role] || member.role) : '';
    
    // Mettre à jour le message de la modale
    const messageElement = document.getElementById('confirm-delete-member-message');
    if (messageElement) {
        messageElement.innerHTML = `
            Vous êtes sur le point de supprimer <strong>${memberEmail}</strong>${memberRole ? ` (${memberRole})` : ''}.<br><br>
            Cette action est <strong>irréversible</strong> et toutes les données associées à ce membre seront définitivement supprimées.
        `;
    }
    
    // Afficher la modale de confirmation
    showModal('confirm-delete-member-modal');
    lucide.createIcons();
}

// Fonction appelée quand l'utilisateur confirme la suppression dans la modale
async function confirmDeleteMemberAction() {
    if (!pendingDeleteMemberId) {
        closeModal('confirm-delete-member-modal');
        return;
    }
    
    const memberId = pendingDeleteMemberId;
    pendingDeleteMemberId = null;
    
    // Fermer la modale
    closeModal('confirm-delete-member-modal');
    
    // Appeler la fonction de suppression
    await performDeleteMember(memberId);
}

// ====================================================================
// FONCTIONS DE GESTION DES ASSIGNATIONS (POUR LE FORMULAIRE MEMBRE)
// ====================================================================

/**
 * Affiche la bonne section d'assignation (parent/prof) selon le rôle.
 */
 function toggleAssignmentSection() {
    const section = document.getElementById('assignment-section');
    const role = document.getElementById('member-role').value;
    const teacherSection = document.getElementById('assignment-for-teacher');
    const parentSection = document.getElementById('assignment-for-parent');
    
    // Cacher les deux sections d'abord
    if (teacherSection) teacherSection.classList.add('hidden');
    if (parentSection) parentSection.classList.add('hidden');
    
    // Vider les sélections pour éviter les bugs
    clearAssignments();
    
    if (role === 'proffesseur') {
        section.classList.remove('hidden');
        teacherSection.classList.remove('hidden');
        initializeAssignmentUI('teacher'); // Initialise l'interface pour le prof
    } else if (role === 'parent') {
        section.classList.remove('hidden');
        parentSection.classList.remove('hidden');
        initializeAssignmentUI('parent'); // Initialise l'interface pour le parent
    } else {
        section.classList.add('hidden'); // Cacher pour le gardien
    }
}

/**
 * Initialise les écouteurs d'événements pour les barres de recherche d'assignation.
 */
function initializeAssignmentUI(mode) {
    if (mode === 'teacher') {
        document.getElementById('teacher-class-search').addEventListener('input', () => renderAssignmentLists('teacher'));
        document.getElementById('teacher-subject-search').addEventListener('input', () => renderAssignmentLists('teacher'));
        document.getElementById('select-all-classes').addEventListener('click', () => toggleSelectAll('class'));
        document.getElementById('select-all-subjects').addEventListener('click', () => toggleSelectAll('subject'));
    } else if (mode === 'parent') {
        document.getElementById('parent-student-search').addEventListener('input', () => renderAssignmentLists('parent'));
        document.getElementById('select-all-students').addEventListener('click', () => toggleSelectAll('student'));
    }
    // Affiche la liste initiale
    renderAssignmentLists(mode);
}

/**
 * Affiche les listes d'élèves/classes/matières filtrées.
 */
function renderAssignmentLists(mode) {
    if (mode === 'teacher') {
        // --- Gère la liste des classes ---
        const classSearchTerm = document.getElementById('teacher-class-search').value.toLowerCase();
        const classesListDiv = document.getElementById('assignment-classes-list');
        const filteredClasses = appData.classes.filter(c => c.name.toLowerCase().includes(classSearchTerm));
        classesListDiv.innerHTML = filteredClasses.map(c => createCheckboxHTML('class', c, c.id)).join('') || emptyListHTML('classe');

        // --- Gère la liste des matières (groupée par classe) ---
        const subjectSearchTerm = document.getElementById('teacher-subject-search').value.toLowerCase();
        const subjectsListDiv = document.getElementById('assignment-subjects-list');
        const filteredSubjects = appData.subjects.filter(s => {
            const subjectClass = appData.classes.find(c => c.id === s.class_id);
            const labelText = subjectClass ? `${s.name} (${subjectClass.name})` : s.name;
            return labelText.toLowerCase().includes(subjectSearchTerm);
        });

        const subjectsByClass = filteredSubjects.reduce((acc, subject) => {
            const classId = subject.class_id || 'unassigned';
            if (!acc[classId]) { acc[classId] = []; }
            acc[classId].push(subject);
            return acc;
        }, {});

        let subjectHtml = Object.keys(subjectsByClass).map(classId => {
            const className = appData.classes.find(c => c.id === classId)?.name || 'Matières non classées';
            const subjectsHtml = subjectsByClass[classId].map(s => createCheckboxHTML('subject', s, s.id)).join('');
            return `
                <details class="mb-2" open>
                    <summary class="font-semibold text-gray-700 cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200">${className}</summary>
                    <div class="pl-4 pt-2 space-y-1">${subjectsHtml}</div>
                </details>
            `;
        }).join('');
        subjectsListDiv.innerHTML = subjectHtml || emptyListHTML('matière');

    } else if (mode === 'parent') {
        // --- Gère la liste des élèves (groupée par classe) ---
        const studentsListDiv = document.getElementById('assignment-students-list');
        const searchTerm = document.getElementById('parent-student-search').value.toLowerCase();
        const filteredStudents = appData.students.filter(student => {
            const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
            return fullName.includes(searchTerm);
        });

        const studentsByClass = filteredStudents.reduce((acc, student) => {
            const classId = student.class_id || 'unassigned';
            if (!acc[classId]) { acc[classId] = []; }
            acc[classId].push(student);
            return acc;
        }, {});
        
        let studentHtml = Object.keys(studentsByClass).map(classId => {
            const className = appData.classes.find(c => c.id === classId)?.name || 'Élèves non assignés';
            const studentsHtml = studentsByClass[classId].map(s => createCheckboxHTML('student', s, s.id)).join('');
            return `
                <details class="mb-2" open>
                    <summary class="font-semibold text-gray-700 cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200">${className}</summary>
                    <div class="pl-4 pt-2 space-y-1">${studentsHtml}</div>
                </details>
            `;
        }).join('');
        studentsListDiv.innerHTML = studentHtml || emptyListHTML('élève');
    }
    
    lucide.createIcons();
    addAssignmentClickListeners();
    updateAssignmentSummary();
}

/**
 * Crée le HTML pour un bouton-checkbox d'assignation.
 */
function createCheckboxHTML(type, item, id) {
    const typeIds = {
        'class': currentAssignments.classIds,
        'subject': currentAssignments.subjectIds,
        'student': currentAssignments.studentIds
    }[type];
    const isChecked = typeIds.has(id);

    let labelText = '';
    if (type === 'subject') {
        const subjectClass = appData.classes.find(c => c.id === item.class_id);
        labelText = subjectClass ? `${item.name} (${subjectClass.name})` : item.name;
    } else if (type === 'student') {
        const classInfo = appData.classes.find(c => c.id === item.class_id);
        labelText = `${item.first_name} ${item.last_name} <span class='text-xs text-gray-500'>(${classInfo ? classInfo.name : 'N/A'})</span>`;
    } else {
        labelText = item.name;
    }

    const selectedClasses = isChecked ?
        'bg-blue-100 text-blue-800 font-semibold border-blue-200' : 
        'bg-white hover:bg-gray-50 border-gray-200';

    return `
        <button 
            type="button" 
            class="w-full flex items-center space-x-3 p-3 border rounded-lg cursor-pointer assignment-item text-left transition-all duration-200 ${selectedClasses}" 
            data-type="${type}" 
            data-id="${id}"
        >
            <i 
                data-lucide="${isChecked ? 'check-circle-2' : 'circle'}" 
                class="h-5 w-5 flex-shrink-0 ${isChecked ? 'text-blue-600' : 'text-gray-400'}"
            ></i>
            <span class="text-sm">${labelText}</span>
        </button>
    `;
}

/**
 * Affiche un message si la liste d'assignation est vide.
 */
function emptyListHTML(itemType) {
    return `<p class="text-sm text-gray-500 text-center py-4">Aucun ${itemType} à assigner</p>`;
}

/**
 * Ajoute les écouteurs de clic pour les boutons-checkbox.
 */
function addAssignmentClickListeners() {
    document.querySelectorAll('.assignment-item').forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            
            const id = button.dataset.id;
            const type = button.dataset.type;
            const set = currentAssignments[`${type}Ids`];
            
            if (set.has(id)) {
                set.delete(id);
            } else {
                set.add(id);
            }
            
            const role = document.getElementById('member-role').value;
            renderAssignmentLists(role === 'proffesseur' ? 'teacher' : 'parent');
        });
    });
}

/**
 * Gère le clic sur "Tout cocher / décocher".
 */
function toggleSelectAll(type) {
    const listContainer = document.getElementById(`assignment-${type}s-list`); // Note: 'type' + 's'
    if (!listContainer) return;

    const allItems = listContainer.querySelectorAll('.assignment-item');
    const shouldCheckAll = Array.from(allItems).some(item => !currentAssignments[`${type}Ids`].has(item.dataset.id));

    allItems.forEach(item => {
        const isChecked = currentAssignments[`${type}Ids`].has(item.dataset.id);
        if (isChecked !== shouldCheckAll) {
            item.click();
        }
    });
}

/**
 * Met à jour le résumé de la sélection.
 */
function updateAssignmentSummary() {
    const summarySpan = document.getElementById('assignment-summary');
    if (!summarySpan) return;
    
    const classCount = currentAssignments.classIds.size;
    const subjectCount = currentAssignments.subjectIds.size;
    const studentCount = currentAssignments.studentIds.size;
    
    summarySpan.innerHTML = `Assignation : 
        <b>${classCount}</b> classe(s), 
        <b>${subjectCount}</b> matière(s), 
        <b>${studentCount}</b> élève(s).`;
}

/**
 * Vide les sélections d'assignation en cours.
 */
function clearAssignments() {
    currentAssignments.classIds.clear();
    currentAssignments.subjectIds.clear();
    currentAssignments.studentIds.clear();
    
    const role = document.getElementById('member-role')?.value;
    if (role === 'proffesseur') {
        renderAssignmentLists('teacher');
    } else if (role === 'parent') {
        renderAssignmentLists('parent');
    }
}

/**
 * Récupère les IDs assignés pour les envoyer à la BDD.
 */
function getSelectedAssignments() {
    const role = document.getElementById('member-role').value;
    if (role === 'proffesseur') {
        return {
            classIds: Array.from(currentAssignments.classIds),
            subjectIds: Array.from(currentAssignments.subjectIds),
            studentIds: [] // S'assure que c'est vide
        };
    } else if (role === 'parent') {
        return {
            classIds: [], // S'assure que c'est vide
            subjectIds: [], // S'assure que c'est vide
            studentIds: Array.from(currentAssignments.studentIds)
        };
    }
    // Pour le gardien ou autre, on envoie tout vide
    return { classIds: [], subjectIds: [], studentIds: [] }; 
}


async function handleAddMember(e) {
      e.preventDefault();

      // 1. Récupérer les données du formulaire
      const rpc_params = {
        member_email: document.getElementById('member-email').value,
        member_password: document.getElementById('member-password').value,
        member_role: document.getElementById('member-role').value,
        class_ids: getSelectedAssignments().classIds || [],
        subject_ids: getSelectedAssignments().subjectIds || [],
        student_ids: getSelectedAssignments().studentIds || [],
        owner_id: currentUser.id // L'ID de l'admin
      };

      try {
        // 2. Appeler la NOUVELLE Edge Function
        notificationManager.show('⏳ Création du compte en cours...', 'info');
        
        const { data, error } = await supabase.functions.invoke('creer-membre', {
          body: rpc_params
        });

        if (error) throw error; // Si la fonction renvoie une erreur

        // 3. Succès !
        appData.members.push(data); // Ajoute le nouveau membre à la liste locale
        notificationManager.show('✅ Membre créé avec succès !', 'success');
        document.getElementById('add-member-form').reset();
        showAddMemberForm(false);
        loadPage('accounts'); // Recharge la page des comptes

      } catch (error) {
          console.error('Erreur brute de l\'Edge Function:', error);
          
          let userMessage = '❌ Erreur: ' + error.message; // Message par défaut

          // --- Le bloc corrigé pour LIRE LA VRAIE ERREUR ---
          try {
              if (error.context && error.context.json) {
                  // Si l'erreur est bien formatée par notre fonction
                  const realError = await error.context.json();
                  console.error("VRAI MESSAGE D'ERREUR DE LA FONCTION :", realError.error);
                  userMessage = `❌ ERREUR FONCTION : ${realError.error}`;
              } else if (error.message.includes('non-2xx status code')) {
                  // Si on ne peut pas la lire, on demande de vérifier les logs
                  userMessage = "❌ Erreur non-2xx. La fonction a crashé. Vérifiez les logs.";
              }
          } catch (e) {
              console.error("Impossible d'analyser l'erreur JSON:", e);
              userMessage = "❌ Erreur non-2xx. Impossible d'analyser la réponse.";
          }
          // --- FIN DU BLOC ---

          // On garde l'ancienne logique pour les cas connus
          if (userMessage.includes('User already registered')) {
              userMessage = '❌ Un compte existe déjà avec cet email.';
          } else if (userMessage.includes('Password should be at least 6 characters')) {
              userMessage = '❌ Le mot de passe doit faire 6 caractères minimum.';
          }
          
          notificationManager.show(userMessage, 'error');
      }
    }

    async function handleEditMember(memberId) {
            if (!currentUser) {
                notificationManager.show('❌ Vous devez être connecté.', 'error');
                return;
            }

            // 1. On trouve le membre pour récupérer son rôle
            const member = appData.members.find(m => m.id === memberId);
            if (!member) {
                notificationManager.show('❌ Erreur: Membre introuvable.', 'error');
                return;
            }
            const role = member.role; 

            // 2. On récupère les listes d'assignations cochées
            const newAssignments = getSelectedAssignments(role);

            // 3. On prépare les données pour la fonction SQL (RPC)
            const rpc_params = {
                membre_id_a_modifier: memberId,
                nouvelles_classes_ids: newAssignments.classIds || [],
                nouvelles_matieres_ids: newAssignments.subjectIds || [],
                nouveaux_etudiants_ids: newAssignments.studentIds || []
            };

            try {
                // 4. On APPELLE LA NOUVELLE FONCTION SQL (RPC)
                notificationManager.show('⏳ Sauvegarde en cours...', 'info');
                
                const { data, error } = await supabase.rpc('modifier_assignations_membre', rpc_params);
                
                if (error) throw error; 

                // 5. Mettre à jour les données locales
                const updatedMember = data[0]; 
                const memberIndex = appData.members.findIndex(m => m.id === memberId);
                if (memberIndex !== -1 && updatedMember) {
                    appData.members[memberIndex] = updatedMember; 
                }

                // 6. Succès !
                showAddMemberForm(false);
                loadPage('accounts');
                notificationManager.show('✅ Membre modifié avec succès !', 'success');

            } catch (error) {
                console.error('❌ Erreur modification membre (RPC):', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            }
        }

async function performDeleteMember(memberId) {
  if (!memberId) return;

  try {
    // Afficher un indicateur de chargement
    notificationManager.show('⏳ Suppression en cours...', 'info');
    
    // 1. Appeler la NOUVELLE Edge Function
    const { data, error } = await supabase.functions.invoke('supprimer-membre', {
      body: { member_id_to_delete: memberId }
    });

    if (error) throw error;

    // 2. Succès ! Mettre à jour les données locales
    appData.members = appData.members.filter(m => m.id !== memberId);
    loadPage('accounts');
    notificationManager.show(`✅ ${data.message || 'Membre supprimé avec succès'}`, 'success');

  } catch (error) {
    console.error('Erreur suppression membre:', error);
    const errorMessage = error.message || 'Une erreur est survenue lors de la suppression';
    notificationManager.show(`❌ Erreur: ${errorMessage}`, 'error');
  }
}

// === FIN DU BLOC À COLLER ===

// === FIN: Gestion page Compte ===

        function addNewFerie() {
            const dateInput = document.getElementById('new-ferie-date');
            const dateStr = dateInput.value;
            
            if (!dateStr) {
                notificationManager.show('⚠️ Veuillez sélectionner une date', 'warning');
                return;
            }
            
            if (addFerie(dateStr)) {
                notificationManager.show('✅ Jour férié ajouté avec succès', 'success');
                dateInput.value = '';
                loadPage('settings');
            } else {
                notificationManager.show('⚠️ Ce jour férié existe déjà', 'warning');
            }
        }

        function getStatusText(status) {
            const statusMap = {
                'present': 'Présent',
                'late': 'En retard', 
                'sick': 'Malade',
                'absent': 'Absent',
                'absent_justified': 'Absence justifiée'
            };
            return statusMap[status] || status;
        }

   /**
    * Calcule le classement des meilleurs élèves avec le VRAI rang dans l'école
    * @param {number} limit - Nombre d'élèves à retourner (après filtrage pour les membres)
    * @returns {Array} Liste des élèves avec leur vrai rang global
    */
   function calculateTopStudents(limit = 10) {
    const studentAverages = [];
    
    // NOUVEAU: Utiliser TOUS les élèves de l'école pour calculer le vrai rang global
    const studentsToCalculate = allSchoolStudents.length > 0 ? allSchoolStudents : appData.students;
    
    studentsToCalculate.forEach(student => {
        const studentGrades = appData.grades.filter(grade => grade.student_id === student.id);
        
        if (studentGrades.length > 0) {
            let totalScore = 0;
            let totalMaxScore = 0;
            
            studentGrades.forEach(grade => {
                const subject = appData.subjects.find(s => s.id === grade.subject_id);
                if (subject) {
                    totalScore += grade.score;
                    totalMaxScore += subject.max_score;
                }
            });
            
            const averagePercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
            
            studentAverages.push({
                student: student,
                average: parseFloat(averagePercentage.toFixed(2)),
                totalScore: totalScore,
                gradeCount: studentGrades.length,
                class: appData.classes.find(c => c.id === student.class_id)?.name || 'Non assigné'
            });
        }
    });
    
    // Trier d'abord par totalScore (points) décroissant, puis par moyenne (pourcentage) décroissant
    const sortedStudents = studentAverages.sort((a, b) => {
        // D'abord par nombre de points
        if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
        }
        // En cas d'égalité de points, trier par pourcentage
        return b.average - a.average;
    });
    
    // Ajouter le vrai rang global à chaque élève
    sortedStudents.forEach((item, index) => {
        item.globalRank = index + 1; // Rang global dans toute l'école (1 = premier, 2 = deuxième, etc.)
    });
    
    // Si c'est un parent, filtrer pour ne garder que ses enfants, mais garder le vrai rang
    if (currentMemberContext && currentMemberContext.role === 'parent') {
        const assignedStudentIds = new Set(currentMemberContext.assigned_student_ids || []);
        const filteredStudents = sortedStudents.filter(item => assignedStudentIds.has(item.student.id));
        return filteredStudents.slice(0, limit);
    }
    
    // Pour les autres rôles, retourner les meilleurs avec leur vrai rang
    return sortedStudents.slice(0, limit);
}

        function getAttendanceStatusByTime() {
            return getAttendanceStatusByTimeWithConfig();
        }

        // Gestion des modals
        function showModal(modalId) {
            // Masquer temporairement l'overlay de connexion si présent (pour permettre l'affichage des modals)
            const offlineOverlay = document.getElementById('offline-overlay');
            if (offlineOverlay) {
                offlineOverlay.style.display = 'none';
            }
            
            document.getElementById('modal-overlay').classList.remove('hidden');
            document.getElementById(modalId).classList.remove('hidden');
            
            // Correction: Ensure z-index order for modals if multiple are open
            document.querySelectorAll('.dialog-content').forEach(modal => {
                if(modal.id !== modalId) modal.style.zIndex = 49;
            });
            document.getElementById(modalId).style.zIndex = 50;

            if (modalId === 'add-student-modal' || modalId === 'edit-student-modal') {
                const selectId = modalId === 'add-student-modal' ? 'student-class' : 'edit-student-class';
                const classSelect = document.getElementById(selectId);
                const currentVal = classSelect.value;
                classSelect.innerHTML = '<option value="">Sélectionner une classe</option>' +
                    appData.classes.map(c => `<option value="${c.id}">${c.name} (${c.level})</option>`).join('');
                classSelect.value = currentVal; // Preserve selection if possible
            }
            
            // Initialiser les icônes Lucide pour tous les modals (y compris le nouveau modal de déconnexion)
            lucide.createIcons();
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
            
            // Check if any other modal is still open
            const anyOtherModalOpen = Array.from(document.querySelectorAll('.dialog-content')).some(modal => !modal.classList.contains('hidden'));

            if (!anyOtherModalOpen) {
                document.getElementById('modal-overlay').classList.add('hidden');
                
                // Réafficher l'overlay de connexion si on est toujours hors ligne
                const offlineOverlay = document.getElementById('offline-overlay');
                if (offlineOverlay && !navigator.onLine) {
                    offlineOverlay.style.display = 'flex';
                }
            } else {
                 // Restore z-index of next topmost modal
                 document.querySelectorAll('.dialog-content').forEach(modal => modal.style.zIndex = 50);
            }
            
            if (modalId === 'justify-absence-modal') {
                document.getElementById('justify-absence-form').reset();
                document.getElementById('justification-proof').value = '';
                document.getElementById('justification-proof-preview').classList.add('hidden');
                document.getElementById('justification-preview-image').src = '';
            }
        }

        function justifyAbsence(attendanceId, studentName, date, studentId) {
            document.getElementById('justify-attendance-id').value = attendanceId;
            document.getElementById('justify-student-id').value = studentId;
            document.getElementById('justify-student-name').textContent = studentName;
            document.getElementById('justify-attendance-date').textContent = new Date(date).toLocaleDateString('fr-FR');
            showModal('justify-absence-modal');
        }

        async function showProofImage(imageUrl, caption) {
            const imgElement = document.getElementById('proof-image-display');
            const captionElement = document.getElementById('proof-image-caption');
            
            // Afficher un indicateur de chargement
            imgElement.style.display = 'none';
            captionElement.textContent = 'Chargement de l\'image...';
            
            // Précharger l'image pour s'assurer qu'elle se charge
            const img = new Image();
            img.onload = () => {
                imgElement.src = imageUrl;
                imgElement.style.display = 'block';
                captionElement.textContent = caption || 'Preuve de justification';
            };
            img.onerror = () => {
                imgElement.style.display = 'none';
                captionElement.textContent = 'Erreur: Impossible de charger l\'image. Vérifiez que l\'URL est correcte.';
                console.error('Erreur chargement image justificatif:', imageUrl);
            };
            img.src = imageUrl;
            
            showModal('proof-image-modal');
        }

        // Fonction pour compresser et convertir une image en base64
        async function compressImageToBase64(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        // Calculer les nouvelles dimensions
                        let width = img.width;
                        let height = img.height;
                        
                        if (width > maxWidth || height > maxHeight) {
                            if (width > height) {
                                height = (height * maxWidth) / width;
                                width = maxWidth;
                            } else {
                                width = (width * maxHeight) / height;
                                height = maxHeight;
                            }
                        }
                        
                        // Créer un canvas pour redimensionner
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Convertir en base64 avec compression
                        const base64 = canvas.toDataURL('image/jpeg', quality);
                        resolve(base64);
                    };
                    img.onerror = reject;
                    img.src = e.target.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        async function handleAddStudent(e) {
            e.preventDefault();
            
            if (!duplicateProtection.startStudentAdd()) return;
            if (!currentUser) {
                notificationManager.show('❌ Session expirée. Veuillez vous reconnecter.', 'error');
                duplicateProtection.endStudentAdd();
                return;
            }

            const photoFile = document.getElementById('student-photo').files[0];
            let photoUrl = null; 

            try {
                if (photoFile) { 
                    notificationManager.show('⏳ Compression et conversion de la photo...', 'info');
                    
                    // Compresser et convertir la photo en base64
                    photoUrl = await compressImageToBase64(photoFile);
                    
                    notificationManager.show('⏳ Photo traitée avec succès...', 'info');
                }

                // --- C'EST LA LIGNE CORRIGÉE ---
                // On remplace Math.random() par currentUser.id
                // (On garde Date.now() pour que chaque élève du MÊME admin soit unique)
                const qrCodeData = `PS_${currentUser.id}_${Date.now()}`;
                // --- FIN DE LA CORRECTION ---

                const qrCodeUrl = await generateQRCode(qrCodeData);

                const studentData = {
                    last_name: document.getElementById('student-lastname').value.trim(),
                    first_name: document.getElementById('student-firstname').value.trim(),
                    class_id: document.getElementById('student-class').value,
                    school: document.getElementById('student-school').value.trim(),
                    school_year: document.getElementById('student-year').value.trim(),
                    matricule: document.getElementById('student-matricule').value.trim() || null,
                    birth_date: document.getElementById('student-birthdate').value || null,
                    birth_place: document.getElementById('student-birthplace').value.trim() || null,
                    parent_phone: document.getElementById('student-parent-phone').value.trim(),
                    parent_email: document.getElementById('student-parent-email').value.trim(),
                    parent_address: document.getElementById('student-parent-address').value.trim(),
                    photo: photoUrl, 
                    qr_code: qrCodeData,
                    qr_code_url: qrCodeUrl,
                    user_id: currentUser.id
                };

                const { data, error } = await supabase.from('students').insert([studentData]).select();
                if (error) throw error;
                
                appData.students.push(data[0]); 
                
                notificationManager.addToHistory({
                    type: 'success',
                    title: 'Nouvel élève ajouté',
                    message: `L'élève ${studentData.first_name} ${studentData.last_name} a été ajouté.`,
                    data: { studentId: data[0].id }
                });
                
                closeModal('add-student-modal');
                document.getElementById('add-student-form').reset();
                document.getElementById('student-photo').value = '';
                document.getElementById('photo-preview').classList.add('hidden');
                document.getElementById('preview-image').src = '';
                loadPage(currentPage);
                notificationManager.show('✅ Élève ajouté avec succès !', 'success');
            } catch (error) {
                console.error('Erreur lors de l\'ajout de l\'élève:', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            } finally {
                duplicateProtection.endStudentAdd();
            }
        }

async function handleEditSubject(e) {
    e.preventDefault();
    if (!currentUser) return;

    try {
        const subjectId = document.getElementById('edit-subject-id').value;
        const subjectData = {
            name: document.getElementById('edit-subject-name').value.trim(),
            max_score: parseInt(document.getElementById('grade-max-score').value)
        };

        const { data, error } = await supabase
            .from('subjects')
            .update(subjectData)
            .eq('id', subjectId)
            .eq('user_id', effectiveUserId)
            .select();
        
        if (error) throw error;
        
        const subjectIndex = appData.subjects.findIndex(s => s.id === subjectId);
        if (subjectIndex !== -1) {
            appData.subjects[subjectIndex] = data[0];
        }
        
        closeModal('edit-subject-modal');
        loadPage('subjects');
        notificationManager.show('✅ Matière modifiée avec succès !', 'success');
        
    } catch (error) {
        console.error('Erreur modification matière:', error);
        notificationManager.show('❌ Erreur: ' + error.message, 'error');
    }
}

        async function handleEditStudent(e) {
            e.preventDefault();
            
            if (!duplicateProtection.startStudentEdit()) return;
            if (!currentUser) {
                notificationManager.show('❌ Session expirée. Veuillez vous reconnecter.', 'error');
                duplicateProtection.endStudentEdit();
                return;
            }

            try {
                const studentId = document.getElementById('edit-student-id').value;
                const studentData = {
                    last_name: document.getElementById('edit-student-lastname').value.trim(),
                    first_name: document.getElementById('edit-student-firstname').value.trim(),
                    class_id: document.getElementById('edit-student-class').value,
                    school: document.getElementById('edit-student-school').value.trim(),
                    school_year: document.getElementById('edit-student-year').value.trim(),
                    matricule: document.getElementById('edit-student-matricule').value.trim() || null,
                    birth_date: document.getElementById('edit-student-birthdate').value || null,
                    birth_place: document.getElementById('edit-student-birthplace').value.trim() || null,
                    parent_phone: document.getElementById('edit-student-parent-phone').value.trim(),
                    parent_email: document.getElementById('edit-student-parent-email').value.trim(),
                    parent_address: document.getElementById('edit-student-parent-address').value.trim()
                };

                const photoFile = document.getElementById('edit-student-photo').files[0];
                if (photoFile) {
                    notificationManager.show('⏳ Compression et conversion de la photo...', 'info');
                    
                    // Compresser et convertir la photo en base64
                    studentData.photo = await compressImageToBase64(photoFile);
                    
                    notificationManager.show('⏳ Photo traitée avec succès...', 'info');
                }

                const { data, error } = await supabase
                    .from('students')
                    .update(studentData)
                    .eq('id', studentId)
                    .eq('user_id', effectiveUserId)
                    .select();
                
                if (error) throw error;
                
                const studentIndex = appData.students.findIndex(s => s.id === studentId);
                if (studentIndex !== -1) {
                    appData.students[studentIndex] = data[0];
                }
                
                closeModal('edit-student-modal');
                if (!document.getElementById('student-profile-modal').classList.contains('hidden')) {
                    await showStudentProfile(studentId);
                } else {
                    loadPage(currentPage);
                }
                notificationManager.show('✅ Élève modifié avec succès !', 'success');
            } catch (error) {
                console.error('Erreur modification élève:', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            } finally {
                duplicateProtection.endStudentEdit();
            }
        }

        async function handleAddClass(e) {
            e.preventDefault();
            
            if (!duplicateProtection.startClassAdd()) return;
            if (!currentUser) {
                notificationManager.show('❌ Session expirée. Veuillez vous reconnecter.', 'error');
                duplicateProtection.endClassAdd();
                return;
            }

            try {
                const classData = {
                    name: document.getElementById('class-name').value.trim(),
                    level: document.getElementById('class-level').value,
                    user_id: currentUser.id
                };

                const { data, error } = await supabase.from('classes').insert([classData]).select();
                if (error) throw error;
                
                appData.classes.push(data[0]);
                
                closeModal('add-class-modal');
                document.getElementById('add-class-form').reset();
                loadPage(currentPage);
                notificationManager.show('✅ Classe créée avec succès !', 'success');
            } catch (error) {
                console.error('Erreur création classe:', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            } finally {
                duplicateProtection.endClassAdd();
            }
        }

        async function handleJustifyAbsence(e) {
            e.preventDefault();
            
            if (!duplicateProtection.startJustifyAbsence()) return;
            if (!currentUser) {
                 notificationManager.show('❌ Session expirée. Veuillez vous reconnecter.', 'error');
                duplicateProtection.endJustifyAbsence();
                return;
            }

            try {
                const attendanceId = document.getElementById('justify-attendance-id').value;
                const studentId = document.getElementById('justify-student-id').value;
                const justificationType = document.getElementById('justification-type').value;
                const note = document.getElementById('justification-note').value.trim();
                const proofFile = document.getElementById('justification-proof').files[0];

                let proofImageUrl = null;

                // --- DÉBUT DE LA MODIFICATION ---
                if (proofFile) {
                    notificationManager.show('⏳ Compression et conversion de la preuve...', 'info');
                    
                    // Compresser et convertir la preuve en base64
                    proofImageUrl = await compressImageToBase64(proofFile);
                    
                    notificationManager.show('⏳ Preuve traitée avec succès...', 'info');
                }
                // --- FIN DE LA MODIFICATION ---

                const justificationData = {
                    attendance_id: attendanceId,
                    student_id: studentId,
                    justification_type: justificationType,
                    justification_note: note,
                    proof_image_url: proofImageUrl, // ⬅️ L'URL ou null
                    user_id: currentUser.id
                };

                const { data: justification, error: justificationError } = await supabase
                    .from('absence_justifications').insert([justificationData]).select();
                if (justificationError) throw justificationError;

                const newStatus = justificationType === 'sick' ? 'sick' : 'absent_justified';
                
                const { data: updatedAttendance, error: attendanceError } = await supabase
                    .from('attendance')
                    .update({ status: newStatus, note: note || 'Justifiée' })
                    .eq('id', attendanceId)
                    .eq('user_id', effectiveUserId)
                    .select();
                if (attendanceError) throw attendanceError;
                
                appData.absenceJustifications.push(justification[0]);
                
                const attendanceIndex = appData.attendance.findIndex(a => a.id === attendanceId);
                if (attendanceIndex !== -1) {
                    appData.attendance[attendanceIndex] = updatedAttendance[0];
                }
                
                closeModal('justify-absence-modal');
                loadPage(currentPage);
                notificationManager.show('✅ Absence justifiée avec succès !', 'success');
            } catch (error) {
                console.error('Erreur justification:', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            } finally {
                duplicateProtection.endJustifyAbsence();
            }
        }

        async function handleAddSubject(e) {
            e.preventDefault();
            
            if (!currentUser) {
                notificationManager.show('❌ Vous devez être connecté.', 'error');
                return;
            }

            try {
                const classId = document.getElementById('add-subject-class-id').value;
                const subjectData = {
                    name: document.getElementById('subject-name').value.trim(),
                    max_score: parseInt(document.getElementById('subject-max-score').value),
                    class_id: classId,
                    user_id: currentUser.id
                };

                const { data, error } = await supabase.from('subjects').insert([subjectData]).select();
                if (error) throw error;
                
                appData.subjects.push(data[0]);
                
                closeModal('add-subject-modal');
                document.getElementById('add-subject-form').reset();
                loadPage('subjects');
                notificationManager.show('✅ Matière ajoutée avec succès !', 'success');
            } catch (error) {
                console.error('Erreur ajout matière:', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            }
        }

        function convertFileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        function preloadImage(url) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(); // L'image est chargée !
                img.onerror = () => resolve(); // On continue même si ça échoue
                img.src = url;
            });
        }

        // Cache pour les URLs signées
        const signedUrlCache = new Map();
        
        // Fonction pour obtenir une URL signée depuis Supabase Storage
        async function getSignedImageUrl(photoUrl) {
            if (!photoUrl || photoUrl.trim() === '') {
                return null;
            }
            
            // Si c'est déjà une URL data: ou une URL complète qui fonctionne, on la retourne
            if (photoUrl.startsWith('data:') || photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
                // Vérifier si c'est une URL Supabase Storage publique
                if (photoUrl.includes('supabase.co/storage/v1/object/public/')) {
                    return photoUrl; // URL publique, on la retourne telle quelle
                }
                // Si c'est une autre URL HTTP, on la retourne
                if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
                    return photoUrl;
                }
            }
            
            // Si c'est un chemin dans le storage (sans URL complète)
            // Essayer d'extraire le bucket et le chemin
            let bucketName = null;
            let filePath = null;
            
            // Vérifier si c'est un chemin de storage
            if (photoUrl.includes('/')) {
                // Essayer de déterminer le bucket depuis le chemin
                if (photoUrl.includes('photos-eleves') || photoUrl.includes('justificatifs')) {
                    const parts = photoUrl.split('/');
                    const bucketIndex = parts.findIndex(p => p === 'photos-eleves' || p === 'justificatifs');
                    if (bucketIndex !== -1) {
                        bucketName = parts[bucketIndex];
                        filePath = parts.slice(bucketIndex + 1).join('/');
                    }
                } else {
                    // Par défaut, essayer photos-eleves
                    bucketName = 'photos-eleves';
                    filePath = photoUrl;
                }
            } else {
                // Si c'est juste un nom de fichier, utiliser photos-eleves par défaut
                bucketName = 'photos-eleves';
                filePath = photoUrl;
            }
            
            if (!bucketName || !filePath) {
                return null;
            }
            
            // Vérifier le cache
            const cacheKey = `${bucketName}/${filePath}`;
            if (signedUrlCache.has(cacheKey)) {
                return signedUrlCache.get(cacheKey);
            }
            
            try {
                // Essayer d'obtenir l'URL publique d'abord
                const { data: publicUrlData } = supabase
                    .storage
                    .from(bucketName)
                    .getPublicUrl(filePath);
                
                if (publicUrlData && publicUrlData.publicUrl) {
                    // Tester si l'URL publique fonctionne
                    const testImg = new Image();
                    testImg.onload = () => {
                        signedUrlCache.set(cacheKey, publicUrlData.publicUrl);
                    };
                    testImg.src = publicUrlData.publicUrl;
                    
                    signedUrlCache.set(cacheKey, publicUrlData.publicUrl);
                    return publicUrlData.publicUrl;
                }
                
                // Si l'URL publique ne fonctionne pas, obtenir une URL signée (valide 1 an)
                const { data: signedUrlData, error: signedError } = await supabase
                    .storage
                    .from(bucketName)
                    .createSignedUrl(filePath, 31536000); // 1 an en secondes
                
                if (!signedError && signedUrlData && signedUrlData.signedUrl) {
                    signedUrlCache.set(cacheKey, signedUrlData.signedUrl);
                    return signedUrlData.signedUrl;
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'URL signée:', error);
            }
            
            return null;
        }
        
        function getSafePhotoUrl(photoUrl) {
            // Si l'URL est nulle ou vide, on retourne une image placeholder
            if (!photoUrl || photoUrl.trim() === '') {
                return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4=';
            }
            
            // Si c'est déjà une URL data: ou une URL HTTP complète, on la retourne
            if (photoUrl.startsWith('data:') || (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'))) {
                // Si c'est une URL Supabase Storage, on la retourne telle quelle
                if (photoUrl.includes('supabase.co/storage/v1/object/public/') || 
                    photoUrl.includes('supabase.co/storage/v1/object/sign/')) {
                    return photoUrl;
                }
                // Autres URLs HTTP
                return photoUrl;
            }
            
            // Si c'est un chemin relatif ou un nom de fichier, on retourne l'URL telle quelle
            // La fonction getSignedImageUrl sera appelée de manière asynchrone dans les composants
            return photoUrl;
        }
        
        // Fonction pour charger une image avec fallback
        async function loadImageWithFallback(imgElement, photoUrl, placeholder = null) {
            if (!photoUrl || photoUrl.trim() === '') {
                if (placeholder) {
                    imgElement.src = placeholder;
                }
                return;
            }
            
            // Si c'est déjà une URL complète qui fonctionne
            if (photoUrl.startsWith('data:') || 
                (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'))) {
                imgElement.src = photoUrl;
                imgElement.onerror = () => {
                    if (placeholder) {
                        imgElement.src = placeholder;
                    }
                };
                return;
            }
            
            // Essayer d'obtenir une URL signée
            const signedUrl = await getSignedImageUrl(photoUrl);
            if (signedUrl) {
                imgElement.src = signedUrl;
                imgElement.onerror = () => {
                    if (placeholder) {
                        imgElement.src = placeholder;
                    }
                };
            } else {
                if (placeholder) {
                    imgElement.src = placeholder;
                }
            }
        }


        function generateQRCode(data) {
            return new Promise((resolve) => {
                const qr = qrcode(0, 'M');
                qr.addData(data);
                qr.make();
                resolve(qr.createDataURL(4));
            });
        }

        async function startScanner() {
            try {
                showModal('scanner-modal');
                
                const video = document.getElementById('scanner-video');
                const overlay = document.getElementById('scanner-overlay');
                const errorMsg = document.getElementById('camera-error-message');
                
                errorMsg.classList.add('hidden');
                overlay.classList.remove('hidden');
                
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                
                video.srcObject = stream;
                await video.play();
                overlay.classList.add('hidden');
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d', { willReadFrequently: true });

                qrScanner = setInterval(() => {
                    if (video.readyState === video.HAVE_ENOUGH_DATA) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        
                        if (code) {
                            handleQRCodeScanned(code.data);
                        }
                    }
                }, 200);
                
            } catch (error) {
                console.error('Erreur caméra:', error);
                closeScanner();
                const errorMsg = document.getElementById('camera-error-message');
                errorMsg.innerHTML = `<div class="camera-error"><p>Erreur d'accès à la caméra: ${error.name}</p></div>`;
                errorMsg.classList.remove('hidden');
            }
        }

        function closeScanner() {
            if (qrScanner) {
                clearInterval(qrScanner);
                qrScanner = null;
            }
            
            const video = document.getElementById('scanner-video');
            if (video && video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
                video.srcObject = null;
            }
            
            closeModal('scanner-modal');
        }

        async function handleQRCodeScanned(qrData) {
            try {
                closeScanner();
                
                if (!qrData.startsWith('PS_')) {
                    notificationManager.show('❌ QR Code invalide', 'error');
                    return;
                }
                
                const student = appData.students.find(s => s.qr_code === qrData);
                if (!student) {
                    notificationManager.show('❌ Élève non trouvé', 'error');
                    return;
                }
                
                const today = new Date().toISOString().split('T')[0];
                const existingAttendance = appData.attendance.find(a => a.student_id === student.id && a.date === today);
                
                if (existingAttendance) {
                    notificationManager.show(`⚠️ ${student.first_name} est déjà marqué comme ${getStatusText(existingAttendance.status)}`, 'warning');
                    return;
                }
                
                if (isFerie()) {
                    const status = prompt(`Jour férié - Statut pour ${student.first_name} ${student.last_name}:\n(present, late, sick, absent)`);
                    if (status && ['present', 'late', 'sick', 'absent'].includes(status)) {
                        await markAttendance(student.id, status, true);
                    }
                } else {
                    const status = getAttendanceStatusByTime();
                    await markAttendance(student.id, status, true);
                }
                
            } catch (error) {
                console.error('Erreur scan QR:', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            }
        }

        async function useManualEntry() {
            closeScanner();
            loadPage('attendance');
            setTimeout(() => {
                document.getElementById('attendance-search').focus();
            }, 200);
        }
        async function markAttendance(studentId, forcedStatus, isScanned = false) {
            // On vérifie qui fait l'action
            const userIdToSave = effectiveUserId; // Utilise l'ID de l'owner si c'est un membre
            if (!userIdToSave) {
                notificationManager.show('❌ Erreur: Impossible d\'identifier le compte principal.', 'error');
                return;
            }

            try {
                const student = appData.students.find(s => s.id === studentId);
                const today = new Date().toISOString().split('T')[0];
                
                // --- DÉBUT DE LA CORRECTION (Logique de temps) ---
                
                let finalStatus = forcedStatus; // On prend le statut du bouton (ex: 'present')

                // Si le statut demandé est "présent" ou "en retard",
                // nous devons VÉRIFIER l'heure.
                // On ne fait confiance qu'aux statuts "sick" (malade) et "absent".
                if (forcedStatus === 'present' || forcedStatus === 'late') {
                    
                    if (isFerie()) {
                        // Si c'est un jour férié, un clic "présent" est toujours "présent".
                        finalStatus = 'present';
                    } else {
                        // Sinon, on calcule le VRAI statut en fonction de l'heure.
                        // C'est cette fonction qui va retourner 'present', 'late', ou 'absent'
                        finalStatus = getAttendanceStatusByTime(); 
                    }
                }
                // Si le statut forcé était 'sick' ou 'absent', on le garde tel quel.
                
                // --- FIN DE LA CORRECTION ---

                const attendanceData = {
                    student_id: studentId,
                    class_id: student.class_id,
                    date: today,
                    status: finalStatus, // ⬅️ On utilise le statut final (corrigé)
                    scanned_at: isScanned ? new Date().toISOString() : null,
                    note: isScanned ? 'Scanné' : 'Manuel',
                    user_id: userIdToSave // <-- ON SAUVEGARDE AU NOM DU PROPRIÉTAIRE
                };

                const { data, error } = await supabase.from('attendance').insert([attendanceData]).select();
                if (error) throw error;
                
                // On met à jour la copie locale des données
                appData.attendance.push(data[0]);
                
                const statusText = getStatusText(finalStatus);
                notificationManager.show(`${student.first_name} ${student.last_name} marqué comme ${statusText}`, 'success');
                
                // On rafraîchit la page actuelle pour que le changement soit visible immédiatement
                if (currentPage === 'attendance') {
                    loadPage('attendance');
                } else if (currentPage === 'history') {
                    loadPage('history');
                }
            } catch (error) {
                console.error('Erreur marquage présence:', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            }
        }

          function showEditAttendanceModal(attendanceId) {
            const attendanceRecord = appData.attendance.find(a => a.id === attendanceId);
            if (!attendanceRecord) {
                notificationManager.show('❌ Enregistrement introuvable', 'error');
                return;
            }
            
            const student = appData.students.find(s => s.id === attendanceRecord.student_id);
            if (!student) {
                notificationManager.show('❌ Élève introuvable', 'error');
                return;
            }

            // Remplir les infos
            document.getElementById('edit-attendance-id').value = attendanceId;
            document.getElementById('edit-attendance-student-name').textContent = `${student.first_name} ${student.last_name}`;
            document.getElementById('edit-attendance-date').textContent = new Date(attendanceRecord.date).toLocaleDateString('fr-FR');

            // Créer les boutons de statut
            const buttonsContainer = document.getElementById('edit-attendance-buttons');
            buttonsContainer.innerHTML = ''; // Vider les anciens boutons
            
            const statuses = [
                { id: 'present', label: 'Présent', icon: 'check', color: 'green' },
                { id: 'late', label: 'En retard', icon: 'clock', color: 'yellow' },
                { id: 'sick', label: 'Malade', icon: 'heart', color: 'purple' },
                { id: 'absent', label: 'Absent', icon: 'x', color: 'red' }
            ];

            statuses.forEach(status => {
                // Ne pas afficher le bouton pour le statut actuel
                if (status.id !== attendanceRecord.status) {
                    const button = document.createElement('button');
                    button.className = `btn btn-outline btn-sm text-${status.color}-600 border-${status.color}-200 hover:bg-${status.color}-50`;
                    button.innerHTML = `<i data-lucide="${status.icon}" class="h-4 w-4 mr-1"></i> ${status.label}`;
                    button.onclick = () => handleEditAttendance(status.id);
                    buttonsContainer.appendChild(button);
                }
            });

            // Gérer le cas où on justifie une absence
            if(attendanceRecord.status === 'absent_justified' || attendanceRecord.status === 'sick') {
                 const button = document.createElement('button');
                 button.className = `btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50`;
                 button.innerHTML = `<i data-lucide="x" class="h-4 w-4 mr-1"></i> Marquer Absent (Non justifié)`;
                 button.onclick = () => handleEditAttendance('absent');
                 buttonsContainer.appendChild(button);
            }

            showModal('edit-attendance-modal');
        }

        /**
         * NOUVEAU: Gère la mise à jour du statut de présence.
         */
        async function handleEditAttendance(newStatus) {
            const attendanceId = document.getElementById('edit-attendance-id').value;
            if (!attendanceId) return;

            try {
                // Si on repasse en "absent", on doit supprimer la justification
                if (newStatus === 'absent') {
                    // Supprimer la justification associée s'il y en a une
                    const { error: deleteError } = await supabase
                        .from('absence_justifications')
                        .delete()
                        .eq('attendance_id', attendanceId);
                    
                    if (deleteError) {
                        console.error('Erreur suppression justification:', deleteError);
                        // On continue quand même pour mettre à jour la présence
                    }
                    
                    // Mettre à jour localement
                    appData.absenceJustifications = appData.absenceJustifications.filter(j => j.attendance_id !== attendanceId);
                }

                const { data, error } = await supabase
                    .from('attendance')
                    .update({ 
                        status: newStatus, 
                        note: 'Modifié manuellement',
                        scanned_at: null // Réinitialiser le scan
                    })
                    .eq('id', attendanceId)
                    .eq('user_id', effectiveUserId) // Sécurité
                    .select();

                if (error) throw error;

                // Mettre à jour les données locales
                const attendanceIndex = appData.attendance.findIndex(a => a.id === attendanceId);
                if (attendanceIndex !== -1) {
                    appData.attendance[attendanceIndex] = data[0];
                }

                closeModal('edit-attendance-modal');
                notificationManager.show('✅ Présence modifiée avec succès !', 'success');
                loadPage(currentPage); // Recharger la page actuelle

            } catch (error) {
                console.error('Erreur modification présence:', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            }
        }

        async function showStudentProfile(studentId) {
            currentStudentId = studentId;
            const student = appData.students.find(s => s.id === studentId);
            
            if (!student) {
                notificationManager.show('❌ Élève non trouvé', 'error');
                return;
            }

            const classItem = appData.classes.find(c => c.id === student.class_id);
            const studentAttendance = appData.attendance.filter(a => a.student_id === studentId)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
            const studentJustifications = appData.absenceJustifications.filter(j => j.student_id === studentId);

            document.getElementById('student-profile-content').innerHTML = `
                <div class="space-y-6">
                    <div class="flex flex-col items-center text-center space-y-4">
                        <img id="student-profile-photo" src="${getSafePhotoUrl(student.photo)}" alt="${student.first_name}" class="student-avatar" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4='">
                        <div>
                            <h2 class="text-2xl font-bold">${student.first_name} ${student.last_name}</h2>
                            <p class="text-gray-600">${classItem?.name || 'Non assigné'} • ${classItem?.level || ''}</p>
                        </div>
                    </div>
                    <div class="card"><div class="card-header"><h3 class="text-lg font-semibold">Informations Personnelles</h3></div><div class="card-content space-y-3"><div class="grid grid-cols-2 gap-4 text-sm"><div><p class="text-gray-600">Né le</p><p class="font-medium">${new Date(student.birth_date).toLocaleDateString('fr-FR')}</p></div><div><p class="text-gray-600">à</p><p class="font-medium">${student.birth_place}</p></div><div><p class="text-gray-600">Établissement</p><p class="font-medium">${student.school}</p></div><div><p class="text-gray-600">Année</p><p class="font-medium">${student.school_year}</p></div></div></div></div>
                    <div class="card"><div class="card-header"><h3 class="text-lg font-semibold">Informations du Parent</h3></div><div class="card-content space-y-3"><div class="space-y-2 text-sm"><div><p class="text-gray-600">Téléphone</p><p class="font-medium">${student.parent_phone}</p></div>${student.parent_email ? `<div><p class="text-gray-600">Email</p><p class="font-medium">${student.parent_email}</p></div>` : ''}${student.parent_address ? `<div><p class="text-gray-600">Adresse</p><p class="font-medium">${student.parent_address}</p></div>` : ''}</div></div></div>
                    <div class="card"><div class="card-header"><h3 class="text-lg font-semibold">Notes</h3></div><div class="card-content"><div class="space-y-3">${(() => {
                        const studentGrades = appData.grades.filter(g => g.student_id === studentId);
                        if (studentGrades.length === 0) return '<p class="text-center text-gray-600 py-4">Aucune note</p>';
                        return studentGrades.map(grade => {
    const subject = appData.subjects.find(s => s.id === grade.subject_id);
    const maxScore = subject ? subject.max_score : 20;
    const percentage = (grade.score / maxScore * 100).toFixed(1);
    // On affiche le nom de la note, et si il n'existe pas, on affiche le nom de la matière.
    const gradeTitle = grade.name || subject?.name || 'Note'; 
    return `<div class="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <h4 class="font-semibold text-lg text-gray-800">${gradeTitle}</h4>
                        <p class="text-sm font-medium text-blue-600">${subject?.name || 'Matière inconnue'}</p>
                        <p class="text-sm text-gray-600 mt-1">${grade.comment || 'Aucun commentaire'}</p>
                    </div>
                    <div class="text-right ml-4">
                        <div class="text-xl font-bold">${grade.score}/${maxScore}</div>
                        <div class="text-sm ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'} font-medium">${percentage}%</div>
                    </div>
                </div>
            </div>`;
}).join('');
                    })()}</div></div></div>
                    <div class="card"><div class="card-header"><h3 class="text-lg font-semibold">Historique Récent</h3></div><div class="card-content"><div class="space-y-2">${studentAttendance.length > 0 ? studentAttendance.map(record => {
                        const statusClass = `status-${record.status}`;
                        const justification = studentJustifications.find(j => j.attendance_id === record.id);
                        return `<div class="flex items-center justify-between p-2 border rounded-lg"><div><p class="font-medium">${new Date(record.date).toLocaleDateString('fr-FR')}</p>${justification ? `<p class="text-xs text-blue-600">${justification.justification_type === 'sick' ? '🩺 Maladie justifiée' : '📋 Absence justifiée'}</p>` : `<p class="text-sm text-gray-600">${record.note || 'Aucune note'}</p>`}</div><span class="badge ${statusClass}">${getStatusText(record.status)}</span></div>`;
                    }).join('') : `<p class="text-center text-gray-600 py-4">Aucun historique</p>`}</div></div></div>
                    <div class="card"><div class="card-header"><h3 class="text-lg font-semibold">QR Code</h3></div><div class="card-content"><div class="text-center"><img src="${student.qr_code_url}" alt="QR Code" class="qr-code mx-auto mb-4"><p class="text-sm text-gray-600">Code: ${student.qr_code}</p></div></div></div>
                

                   <div class="card">
                        <div class="card-header flex justify-between items-center">
                            <h3 class="text-lg font-semibold">Carnet de Liaison</h3>
                            <button onclick="refreshMessages('${student.id}')" class="btn btn-ghost btn-sm btn-icon" title="Actualiser">
                                <i data-lucide="refresh-cw" class="h-4 w-4"></i>
                            </button>
                        </div>
                        <div class="card-content">
                            <div id="messages-container-${student.id}" class="max-h-64 overflow-y-auto mb-4 p-2 border rounded-lg bg-gray-50 scroll-touch">
                                </div>
                            
                            <div class="flex space-x-2">
                                <input 
                                    type="text" 
                                    id="message-input-${student.id}" 
                                    class="input flex-1" 
                                    placeholder="Écrire un message..."
                                    onkeydown="if(event.key === 'Enter') handleSendStudentMessage('${student.id}')"
                                >
                                <button id="send-btn-${student.id}" onclick="handleSendStudentMessage('${student.id}')" class="btn btn-default btn-icon">
                                    <i data-lucide="send" class="h-4 w-4"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    </div>`;

                    loadStudentMessages(studentId, `messages-container-${studentId}`);

            // Charger l'image avec fallback après le rendu
            setTimeout(async () => {
                const profilePhoto = document.getElementById('student-profile-photo');
                if (profilePhoto && student.photo) {
                    const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4=';
                    await loadImageWithFallback(profilePhoto, student.photo, placeholder);
                }
            }, 50);

            showModal('student-profile-modal');
            // Cacher les boutons de partage pour les membres après l'ouverture de la modale
            setTimeout(() => {
                hideAllShareButtons();
                lucide.createIcons();
            }, 100);
        }

        function showEditStudentModal(studentId) {
            const student = appData.students.find(s => s.id === studentId);
            if (!student) return;

            document.getElementById('edit-student-id').value = student.id;
            document.getElementById('edit-student-lastname').value = student.last_name;
            document.getElementById('edit-student-firstname').value = student.first_name;
            document.getElementById('edit-student-school').value = student.school;
            document.getElementById('edit-student-year').value = student.school_year;
            document.getElementById('edit-student-matricule').value = student.matricule || '';
            document.getElementById('edit-student-birthdate').value = student.birth_date || '';
            document.getElementById('edit-student-birthplace').value = student.birth_place || '';
            document.getElementById('edit-student-parent-phone').value = student.parent_phone;
            document.getElementById('edit-student-parent-email').value = student.parent_email || '';
            document.getElementById('edit-student-parent-address').value = student.parent_address || '';
            document.getElementById('edit-preview-image').src = getSafePhotoUrl(student.photo);
            
            showModal('edit-student-modal');
            document.getElementById('edit-student-class').value = student.class_id;
        }

        function showDeleteStudentModal() {
            const select = document.getElementById('delete-student-select');
            select.innerHTML = '<option value="">Sélectionner un élève</option>' +
                appData.students.sort((a,b) => a.last_name.localeCompare(b.last_name)).map(s => `
                    <option value="${s.id}">${s.first_name} ${s.last_name}</option>`).join('');
            showModal('delete-student-modal');
        }

        function confirmDeleteStudent() {
            const studentId = document.getElementById('delete-student-select').value;
            if (!studentId) return;
            confirmDeleteStudentFromProfile(studentId);
        }

        function confirmDeleteStudentFromProfile(studentId) {
            const student = appData.students.find(s => s.id === studentId);
            if (!student) return;

            document.getElementById('delete-confirm-message').textContent = `Supprimer "${student.first_name} ${student.last_name}" ? Cette action est irréversible.`;
            document.getElementById('delete-confirm-input').value = '';
            document.getElementById('delete-confirm-btn').onclick = () => performDeleteStudent(studentId);
            
            closeModal('delete-student-modal');
            closeModal('student-profile-modal');
            showModal('delete-confirm-modal');
        }

        async function performDeleteStudent(studentId) {
            if (document.getElementById('delete-confirm-input').value !== 'SUPPRIMER') {
                notificationManager.show('❌ Texte de confirmation incorrect.', 'error');
                return;
            }

            try {
                // Supabase cascade delete should handle related data if set up correctly.
                // For safety, we can delete them manually.
                await supabase.from('absence_justifications').delete().eq('student_id', studentId);
                await supabase.from('attendance').delete().eq('student_id', studentId);
                await supabase.from('grades').delete().eq('student_id', studentId);
                await supabase.from('student_messages').delete().eq('student_id', studentId);
                const { error } = await supabase.from('students').delete().eq('id', studentId);
                if (error) throw error;

                appData.students = appData.students.filter(s => s.id !== studentId);

                closeModal('delete-confirm-modal');
                loadPage(currentPage);
                notificationManager.show('✅ Élève supprimé avec succès', 'success');
            } catch (error) {
                console.error('Erreur suppression élève:', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            }
        }

        function showDeleteClassModal() {
            const select = document.getElementById('delete-class-select');
            select.innerHTML = '<option value="">Sélectionner une classe</option>' +
                appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            showModal('delete-class-modal');
        }

        function confirmDeleteClass() {
            const classId = document.getElementById('delete-class-select').value;
            if (!classId) return;
            const classItem = appData.classes.find(c => c.id === classId);
            const studentsInClass = appData.students.filter(s => s.class_id === classId);
            
            document.getElementById('delete-confirm-message').textContent = `Supprimer la classe "${classItem.name}" ? Cela supprimera également ses ${studentsInClass.length} élève(s). Irréversible.`;
            document.getElementById('delete-confirm-input').value = '';
            document.getElementById('delete-confirm-btn').onclick = () => performDeleteClass(classId);
            
            closeModal('delete-class-modal');
            showModal('delete-confirm-modal');
        }

        async function performDeleteClass(classId) {
            if (document.getElementById('delete-confirm-input').value !== 'SUPPRIMER') {
                notificationManager.show('❌ Texte de confirmation incorrect.', 'error');
                return;
            }

            try {
                // Supabase cascade delete should handle related students and their data.
                const { error } = await supabase.from('classes').delete().eq('id', classId);
                if (error) throw error;

                // Manually update local state
                const studentIdsInClass = appData.students.filter(s => s.class_id === classId).map(s => s.id);
                appData.classes = appData.classes.filter(c => c.id !== classId);
                appData.students = appData.students.filter(s => s.class_id !== classId);
                appData.attendance = appData.attendance.filter(a => a.class_id !== classId);
                appData.subjects = appData.subjects.filter(s => s.class_id !== classId);
                appData.grades = appData.grades.filter(g => !studentIdsInClass.includes(g.student_id));
                appData.absenceJustifications = appData.absenceJustifications.filter(j => !studentIdsInClass.includes(j.student_id));

                closeModal('delete-confirm-modal');
                loadPage(currentPage);
                notificationManager.show('✅ Classe supprimée avec succès', 'success');
            } catch (error) {
                console.error('Erreur suppression classe:', error);
                notificationManager.show('❌ Erreur: ' + error.message, 'error');
            }
        }
/**
         * Convertit une URL d'image en base64 (pour le PDF)
         */
         async function convertUrlToBase64(url) {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (e) {
                console.error("Erreur conversion image en base64:", e);
                return null; // Retourne null si ça échoue
            }
        }

        async function shareStudentProfileAsync() {
            try {
                notificationManager.show('⏳ Préparation du PDF...', 'info');
                const student = appData.students.find(s => s.id === currentStudentId);
                if (!student) return;

                const classItem = appData.classes.find(c => c.id === student.class_id);
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // En-tête professionnel
                doc.setFontSize(20).setTextColor(40, 40, 40);
                doc.text('PROFIL ÉLÈVE', 105, 20, { align: 'center' });
                doc.setFontSize(14).setTextColor(100, 100, 100);
                doc.text(`${appData.schoolSettings.school_name}`, 105, 30, { align: 'center' });
                
                // Photo de l'élève
                if (student.photo) {
                    try {
                        const photoBase64 = student.photo.startsWith('data:') 
                            ? student.photo 
                            : await convertUrlToBase64(getSafePhotoUrl(student.photo));
                        if (photoBase64) {
                            doc.addImage(photoBase64, 'JPEG', 150, 45, 40, 40);
                        }
                    } catch (e) {
                        console.error('Erreur chargement photo:', e);
                    }
                }
                
                let y = 50;
                
                // Informations Personnelles
                doc.setFontSize(14).setTextColor(40, 40, 40);
                doc.setFont('helvetica', 'bold');
                doc.text('Informations Personnelles', 20, y);
                doc.setFont('helvetica', 'normal');
                y += 8;
                
                doc.setFontSize(10).setTextColor(0, 0, 0);
                doc.text(`Nom: ${student.last_name}`, 25, y); y += 6;
                doc.text(`Prénom: ${student.first_name}`, 25, y); y += 6;
                if (student.matricule) {
                    doc.text(`Matricule: ${student.matricule}`, 25, y); y += 6;
                }
                if (student.birth_date) {
                    doc.text(`Date de naissance: ${new Date(student.birth_date).toLocaleDateString('fr-FR')}`, 25, y); y += 6;
                }
                if (student.birth_place) {
                    doc.text(`Lieu de naissance: ${student.birth_place}`, 25, y); y += 6;
                }
                
                // Classe et établissement
                if (classItem) {
                    doc.text(`Classe: ${classItem.name}`, 25, y); y += 6;
                    if (classItem.level) {
                        doc.text(`Niveau: ${classItem.level}`, 25, y); y += 6;
                    }
                }
                if (student.school) {
                    doc.text(`Établissement: ${student.school}`, 25, y); y += 6;
                }
                if (student.school_year) {
                    doc.text(`Année scolaire: ${student.school_year}`, 25, y); y += 6;
                }
                y += 5;
                
                // Informations du Parent
                doc.setFontSize(14).setTextColor(40, 40, 40);
                doc.setFont('helvetica', 'bold');
                doc.text('Informations du Parent', 20, y);
                doc.setFont('helvetica', 'normal');
                y += 8;
                
                doc.setFontSize(10).setTextColor(0, 0, 0);
                doc.text(`Téléphone: ${student.parent_phone}`, 25, y); y += 6;
                if (student.parent_email) {
                    doc.text(`Email: ${student.parent_email}`, 25, y); y += 6;
                }
                if (student.parent_address) {
                    doc.text(`Adresse: ${student.parent_address}`, 25, y); y += 6;
                }
                y += 5;
                
                // QR Code
                if (student.qr_code_url) {
                    doc.setFontSize(14).setTextColor(40, 40, 40);
                    doc.setFont('helvetica', 'bold');
                    doc.text('QR Code', 20, y);
                    doc.setFont('helvetica', 'normal');
                    y += 8;
                    
                    try {
                        const qrBase64 = student.qr_code_url.startsWith('data:')
                            ? student.qr_code_url
                            : await convertUrlToBase64(student.qr_code_url);
                        doc.addImage(qrBase64, 'PNG', 80, y, 50, 50);
                        doc.setFontSize(9).setTextColor(100, 100, 100);
                        doc.text(`Code: ${student.qr_code || 'N/A'}`, 105, y + 55, { align: 'center' });
                    } catch (e) {
                        console.error('Erreur chargement QR code:', e);
                        doc.setFontSize(10).setTextColor(150, 150, 150);
                        doc.text('QR Code non disponible', 80, y + 25);
                    }
                }
                
                const pdfBlob = doc.output('blob');
                const filename = `Profil_${student.first_name}_${student.last_name}.pdf`;
                await sharePDFMobile(pdfBlob, filename, `Profil de ${student.first_name}`);
                
            } catch (error) {
                console.error('Erreur partage profil:', error);
                notificationManager.show('❌ Erreur lors du partage.', 'error');
            }
        }


        async function shareStudentHistoryAsync() {
           try {
                notificationManager.show('⏳ Préparation du PDF...', 'info');
                const student = appData.students.find(s => s.id === currentStudentId);
                if (!student) return;

                const studentAttendance = appData.attendance.filter(a => a.student_id === currentStudentId).sort((a, b) => new Date(b.date) - new Date(a.date));
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                doc.setFontSize(20).text('HISTORIQUE DES PRÉSENCES', 105, 20, { align: 'center' });
                doc.setFontSize(12).setTextColor(100).text(`${student.first_name} ${student.last_name}`, 105, 30, { align: 'center' });
                
                let y = 50;
                studentAttendance.forEach(record => {
                    if (y > 270) { doc.addPage(); y = 20; }
                    doc.setFontSize(10).setTextColor(0);
                    doc.text(`${new Date(record.date).toLocaleDateString('fr-FR')}:`, 25, y);
                    doc.text(getStatusText(record.status), 80, y);
                    doc.setTextColor(150).text(record.note || '', 120, y);
                    y += 7;
                });
                
                const pdfBlob = doc.output('blob');
                const filename = `Historique_${student.first_name}.pdf`;
                await sharePDFMobile(pdfBlob, filename, `Historique de ${student.first_name}`);
            } catch (error) {
                console.error('Erreur partage historique:', error);
                notificationManager.show('❌ Erreur lors du partage.', 'error');
            }
        }

        async function shareHistoryToPDFAsync() {
            try {
                notificationManager.show('⏳ Préparation du PDF...', 'info');
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                doc.setFontSize(20).text('HISTORIQUE COMPLET', 105, 20, { align: 'center' });
                let y = 40;
                
                const sortedAttendance = [...appData.attendance].sort((a, b) => new Date(b.date) - new Date(a.date));
                
                sortedAttendance.forEach(record => {
                    if (y > 270) { doc.addPage(); y = 20; }
                    const student = appData.students.find(s => s.id === record.student_id);
                    if (!student) return;
                    
                    doc.setFontSize(9).setTextColor(0);
                    doc.text(`${new Date(record.date).toLocaleDateString('fr-FR')} - ${student.first_name} ${student.last_name}`, 25, y);
                    doc.text(getStatusText(record.status), 150, y);
                    y += 6;
                });
                
                const pdfBlob = doc.output('blob');
                const filename = `Historique_Complet.pdf`;
                await sharePDFMobile(pdfBlob, filename, 'Historique complet');
            } catch (error) {
                console.error('Erreur partage historique complet:', error);
                notificationManager.show('❌ Erreur lors du partage.', 'error');
            }
        }

        function showShareClassProfilesModal() {
            const select = document.getElementById('share-class-select');
            select.innerHTML = '<option value="">Sélectionner une classe</option>' +
                appData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            showModal('share-class-profiles-modal');
        }

        async function generateClassProfilesPDFAsync() {
            try {
                notificationManager.show('⏳ Préparation du PDF...', 'info');
                const classId = document.getElementById('share-class-select').value;
                if (!classId) return;

                const classItem = appData.classes.find(c => c.id === classId);
                const students = appData.students.filter(s => s.class_id === classId);
                if (!classItem || students.length === 0) return;

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // En-tête professionnel
                doc.setFontSize(18).setTextColor(40, 40, 40);
                doc.setFont('helvetica', 'bold');
                doc.text(`PROFILS DES ÉLÈVES - ${classItem.name}`, 105, 20, { align: 'center' });
                
                doc.setFontSize(12).setTextColor(100, 100, 100);
                doc.setFont('helvetica', 'normal');
                doc.text(`${appData.schoolSettings.school_name}`, 105, 30, { align: 'center' });
                
                let y = 45;
                
                for (const student of students) {
                    // Nouvelle page si nécessaire
                    if (y > 200) { 
                        doc.addPage(); 
                        y = 20; 
                    }
                    
                    // Photo de l'élève (si disponible)
                    if (student.photo) {
                        try {
                            const photoBase64 = student.photo.startsWith('data:') 
                                ? student.photo 
                                : await convertUrlToBase64(getSafePhotoUrl(student.photo));
                            doc.addImage(photoBase64, 'JPEG', 20, y, 30, 30);
                        } catch (e) {
                            console.error('Erreur chargement photo:', e);
                        }
                    }
                    
                    // QR Code (si disponible)
                    if (student.qr_code_url) {
                        try {
                            const qrBase64 = student.qr_code_url.startsWith('data:')
                                ? student.qr_code_url
                                : await convertUrlToBase64(student.qr_code_url);
                            doc.addImage(qrBase64, 'PNG', 160, y, 30, 30);
                        } catch (e) {
                            console.error('Erreur chargement QR:', e);
                        }
                    }
                    
                    // Informations de l'élève
                    const startX = 60;
                    doc.setFontSize(12).setTextColor(0, 0, 0);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${student.first_name} ${student.last_name}`, startX, y + 5);
                    
                    y += 8;
                    doc.setFontSize(9).setTextColor(80, 80, 80);
                    doc.setFont('helvetica', 'normal');
                    
                    if (student.matricule) {
                        doc.text(`Matricule: ${student.matricule}`, startX, y);
                        y += 5;
                    }
                    
                    if (student.birth_date) {
                        doc.text(`Né le ${new Date(student.birth_date).toLocaleDateString('fr-FR')}`, startX, y);
                        y += 5;
                    }
                    
                    if (student.birth_place) {
                        doc.text(`Lieu: ${student.birth_place}`, startX, y);
                        y += 5;
                    }
                    
                    doc.text(`Parent: ${student.parent_phone}`, startX, y);
                    y += 5;
                    
                    if (student.parent_email) {
                        doc.text(`Email: ${student.parent_email}`, startX, y);
                        y += 5;
                    }
                    
                    y += 10; // Espace entre les profils
                }
                
                const pdfBlob = doc.output('blob');
                const filename = `Profils_${classItem.name}.pdf`;
                await sharePDFMobile(pdfBlob, filename, `Profils des élèves - ${classItem.name}`);
                notificationManager.show('✅ PDF généré avec succès', 'success');
            } catch (error) {
                console.error('Erreur PDF classe:', error);
                notificationManager.show('❌ Erreur lors de la génération.', 'error');
            }
        }
        // Écrit par mohamed
        async function saveAppSettings() {
            try {
                if (!effectiveUserId) {
                    notificationManager.show('❌ Vous devez être connecté.', 'error');
                    return;
                }

                appData.settings.appName = document.getElementById('setting-app-name').value;
                appData.settings.alertThreshold = parseInt(document.getElementById('setting-alert-threshold').value);
                
                // Sauvegarder les heures de présence
                // Écrit par khaled
                appData.settings.attendanceTimes.presentUntil = document.getElementById('setting-present-until').value;
                appData.settings.attendanceTimes.lateUntil = document.getElementById('setting-late-until').value;
                appData.settings.attendanceTimes.autoAbsentAfter = document.getElementById('setting-auto-absent-after').value;

                // Sauvegarder dans localStorage
                saveSettings();

                // Sauvegarder le nom de l'application dans Supabase pour qu'il soit synchronisé entre tous les utilisateurs
                // Essayer d'abord de mettre à jour
                const { data: updateData, error: updateError } = await supabase
                    .from('school_settings')
                    .update({ school_name: appData.settings.appName })
                    .eq('user_id', effectiveUserId)
                    .select();

                let settingsError = updateError;
                
                // Si aucune ligne n'a été mise à jour, insérer
                if (!updateError && (!updateData || updateData.length === 0)) {
                    const { error: insertError } = await supabase
                        .from('school_settings')
                        .insert({
                            user_id: effectiveUserId,
                            school_name: appData.settings.appName
                        });
                    settingsError = insertError;
                }

                if (settingsError) {
                    console.error('Erreur sauvegarde nom application dans Supabase:', settingsError);
                    // On continue quand même car localStorage est sauvegardé
                } else {
                    // Synchroniser avec schoolSettings
                    appData.schoolSettings.school_name = appData.settings.appName;
                }

                // Mettre à jour l'UI
                document.getElementById('app-name').textContent = appData.settings.appName;
                if (document.getElementById('login-school-name')) {
                    document.getElementById('login-school-name').textContent = appData.settings.appName;
                }

                notificationManager.show('✅ Paramètres sauvegardés', 'success');
            } catch (error) {
                console.error('Erreur sauvegarde paramètres:', error);
                const errorMsg = error.message && (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('connection'))
                    ? 'Erreur de connexion'
                    : 'Erreur de sauvegarde';
                notificationManager.show(`❌ ${errorMsg}`, 'error');
            }
        }

        // Écrit par mohamed
        async function saveSchoolSettings() {
            try {
                // Plus besoin de sauvegarder le nom de l'école car il est remplacé par l'option de message
                // On garde juste la sauvegarde des jours fériés si nécessaire
                
                notificationManager.show('✅ Paramètres de l\'école sauvegardés', 'success');
            } catch (error) {
                console.error('Erreur sauvegarde paramètres école:', error);
                const errorMsg = error.message && (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('connection'))
                    ? 'Erreur de connexion'
                    : 'Erreur de sauvegarde';
                notificationManager.show(`❌ ${errorMsg}`, 'error');
            }
        }

        // Final init
        lucide.createIcons();
        function togglePasswordVisibility(inputId, iconId) {
            const input = document.getElementById(inputId);
            const icon = document.getElementById(iconId);
            if (!input || !icon) return;

            if (input.type === "password") {
                input.type = "text";
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = "password";
                icon.setAttribute('data-lucide', 'eye');
            }
            lucide.createIcons(); // Met à jour l'icône
        }

/**
         * NOUVEAU: Charge les messages pour un élève spécifique
         */
         async function loadStudentMessages(studentId, containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = '<p class="text-gray-500 text-center py-4">Chargement des messages...</p>';

            try {
                const { data, error } = await supabase
                    .from('student_messages')
                    .select('*')
                    .eq('student_id', studentId) // Pour cet élève
                    .eq('owner_user_id', effectiveUserId) // Pour cette école
                    .order('created_at', { ascending: true }); // Du plus ancien au plus récent

                if (error) throw error;

                if (data.length === 0) {
                    container.innerHTML = '<p class="text-gray-500 text-center py-4">Aucun message pour cet élève.</p>';
                    return;
                }

                container.innerHTML = data.map(message => {
                    // On vérifie si le message vient de NOUS (la personne connectée)
                    // Écrit par mohamed
                    const isMyMessage = message.sender_auth_id === currentUser.id;
                    // L'admin peut supprimer tous les messages
                    // Écrit par khaled
                    const canDelete = !currentMemberContext; // Seul l'admin peut supprimer
                    
                    return `
                        <div class="flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-3">
                            <div class="p-3 rounded-lg max-w-[80%] ${isMyMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} shadow-md relative">
                                ${canDelete ? `
                                    <button onclick="deleteMessage('${message.id}', '${studentId}')" class="absolute top-1 right-1 text-red-500 hover:text-red-700" title="Supprimer">
                                        <i data-lucide="x" class="h-4 w-4"></i>
                                    </button>
                                ` : ''}
                                <p class="text-sm font-semibold mb-1">${message.sender_name}</p>
                                <p class="text-sm">${message.content}</p>
                                <p class="text-xs opacity-70 text-right mt-1">
                                    ${new Date(message.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    `;
                }).join('');
                
                // Réinitialiser les icônes Lucide
                lucide.createIcons();
                
                // Fait défiler jusqu'au dernier message
                container.scrollTop = container.scrollHeight;

            } catch (error) {
                console.error("Erreur chargement messages:", error);
                container.innerHTML = '<p class="text-red-500 text-center py-4">Erreur de chargement des messages.</p>';
            }
        }

        /**
         * NOUVEAU: Envoie un message dans le carnet de l'élève
         */
         async function handleSendStudentMessage(studentId) {
            const input = document.getElementById(`message-input-${studentId}`);
            const content = input.value.trim();
            if (content.length === 0) return; // Ne pas envoyer de message vide

            let senderName = "Admin"; // Par défaut, c'est l'admin

            if (currentMemberContext) {
                if (currentMemberContext.role === 'proffesseur') {
                    senderName = "Professeur"; 
                } else if (currentMemberContext.role === 'parent') {
                    senderName = "Parent";
                }
            }

            const messageData = {
                student_id: studentId,
                owner_user_id: effectiveUserId, 
                sender_auth_id: currentUser.id, 
                sender_name: senderName,
                content: content,
                is_read: false
            };

            // *** DÉBUT DE LA CORRECTION ***
            // On trouve le bouton par son NOUVEL ID (plus fiable)
            const sendButton = document.getElementById(`send-btn-${studentId}`);
            // *** FIN DE LA CORRECTION ***

            try {
                // On désactive le bouton et l'input
                input.disabled = true;
                if (sendButton) sendButton.disabled = true; // On vérifie s'il existe

                const { data, error } = await supabase.from('student_messages').insert([messageData]);
                
                // On réactive les champs
                input.disabled = false;
                if (sendButton) sendButton.disabled = false;

                if (error) throw error;
                
                input.value = ""; // Vider le champ
                input.focus(); // Remettre le curseur
                loadStudentMessages(studentId, `messages-container-${studentId}`);

            } catch (error) {
                // On réactive les champs même en cas d'erreur
                input.disabled = false;
                if (sendButton) sendButton.disabled = false;
                console.error("Erreur envoi message:", error);
                notificationManager.show('❌ Erreur lors de l\'envoi', 'error');
            }
        }
        /**
         * NOUVEAU: Recharge les messages
         * Écrit par mohamed
         */
        function refreshMessages(studentId) {
             loadStudentMessages(studentId, `messages-container-${studentId}`);
        }

        /**
         * NOUVEAU: Envoie un message à tous les parents d'élèves
         * Écrit par khaled
         */
        async function sendMessageToAllParents() {
            const messageInput = document.getElementById('message-to-all-parents');
            const content = messageInput.value.trim();
            
            if (!content) {
                notificationManager.show('❌ Veuillez écrire un message', 'error');
                return;
            }

            if (!currentUser || !effectiveUserId) {
                notificationManager.show('❌ Session expirée', 'error');
                return;
            }

            try {
                // Récupérer tous les élèves
                const allStudents = appData.students;
                
                if (allStudents.length === 0) {
                    notificationManager.show('❌ Aucun élève trouvé', 'error');
                    return;
                }

                const senderName = "Admin";
                const messagesToInsert = allStudents.map(student => ({
                    student_id: student.id,
                    owner_user_id: effectiveUserId,
                    sender_auth_id: currentUser.id,
                    sender_name: senderName,
                    content: content,
                    is_read: false
                }));

                // Insérer tous les messages en une seule requête
                const { error } = await supabase
                    .from('student_messages')
                    .insert(messagesToInsert);

                if (error) throw error;

                // Vider le champ
                messageInput.value = '';
                notificationManager.show(`✅ Message envoyé à ${allStudents.length} parent(s)`, 'success');
            } catch (error) {
                console.error('Erreur envoi message à tous les parents:', error);
                const errorMsg = error.message && (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('connection'))
                    ? 'Erreur de connexion'
                    : 'Erreur lors de l\'envoi du message';
                notificationManager.show(`❌ ${errorMsg}`, 'error');
            }
        }

        /**
         * NOUVEAU: Supprime un message (admin uniquement)
         * Écrit par mohamed
         */
        // Fonction pour demander confirmation avant de supprimer un message
        function confirmDeleteMessage(messageId, studentId) {
            if (currentMemberContext) {
                notificationManager.show('❌ Seul l\'administrateur peut supprimer un message', 'error');
                return;
            }

            // Stocker les IDs pour la confirmation
            pendingDeleteMessageId = messageId;
            pendingDeleteMessageStudentId = studentId;

            // Afficher la modale de confirmation
            showModal('confirm-delete-message-modal');
            lucide.createIcons();
        }

        // Fonction appelée quand l'utilisateur confirme la suppression dans la modale
        async function confirmDeleteMessageAction() {
            if (!pendingDeleteMessageId || !pendingDeleteMessageStudentId) {
                closeModal('confirm-delete-message-modal');
                return;
            }

            const messageId = pendingDeleteMessageId;
            const studentId = pendingDeleteMessageStudentId;
            
            // Réinitialiser les variables
            pendingDeleteMessageId = null;
            pendingDeleteMessageStudentId = null;

            // Fermer la modale
            closeModal('confirm-delete-message-modal');

            // Appeler la fonction de suppression
            await performDeleteMessage(messageId, studentId);
        }

        // Fonction qui effectue réellement la suppression
        async function performDeleteMessage(messageId, studentId) {
            try {
                // CORRECTION: Vérifier d'abord que le message existe et appartient bien à l'utilisateur
                const { data: messageCheck, error: checkError } = await supabase
                    .from('student_messages')
                    .select('id, owner_user_id')
                    .eq('id', messageId)
                    .eq('owner_user_id', effectiveUserId)
                    .single();

                if (checkError || !messageCheck) {
                    throw new Error('Message introuvable ou vous n\'avez pas les permissions');
                }

                // CORRECTION: Supprimer le message
                // Note: En Supabase, .delete() retourne un tableau vide si la suppression réussit
                // On vérifie seulement s'il y a une erreur, pas la longueur du résultat
                const { error: deleteError } = await supabase
                    .from('student_messages')
                    .delete()
                    .eq('id', messageId)
                    .eq('owner_user_id', effectiveUserId);

                if (deleteError) {
                    console.error('Erreur Supabase:', deleteError);
                    throw deleteError;
                }

                // CORRECTION: Attendre un peu avant de recharger pour s'assurer que la BDD est à jour
                await new Promise(resolve => setTimeout(resolve, 100));

                // Recharger les messages
                await loadStudentMessages(studentId, `messages-container-${studentId}`);
                notificationManager.show('✅ Message supprimé avec succès', 'success');
            } catch (error) {
                console.error('Erreur suppression message:', error);
                const errorMsg = error.message || 'Erreur lors de la suppression';
                notificationManager.show(`❌ ${errorMsg}`, 'error');
            }
        }

        // Alias pour compatibilité avec le code existant
        async function deleteMessage(messageId, studentId) {
            confirmDeleteMessage(messageId, studentId);
        }
