import React from 'react';
import Navbar from './components/Navbar';
import ParentSection from './components/ParentSection';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

function App() {
  const parentSections = [
    {
      id: 'intro',
      title: 'Intro',
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          content: [
            {
              type: 'paragraph',
              text: 'To stitch multiple images together, we need to perform two main steps: image alignment and the stitching process. Image alignment is achieved by calculating the transformation function between the images. Alignment methods can be pixel-based or feature-based. In this project, feature-based alignment is used because it is more robust to variations and more efficient to compute.'
            },
          ]
        },
        {
          id: 'feature-detection-and-matching',
          title: 'Feature Detector, Descriptor and Matching',
          content: [
            {
              type: 'paragraph',
              text: 'Features can be detected and matched manually or automatically. We will demonstrate both approaches.'
            },
          ]
        },
        {
          id: 'stitching-process',
          title: 'Stitching Process',
          content: [
            {
              type: 'paragraph',
              text: 'Once the features have been detected and matched, the stiching process involves: Identifying the transformation functions, choosing a composition surface, determining the order of compositions, performing warping and padding, and followed by blending. Some examples are shown below.'
            },
          ]
        },
      ]
    },
    {
      id: 'homography-planar',
      title: 'Homography onto Planar Surface',
      sections: [
        {
          id: 'homography',
          title: 'Homography',
          content: [
            {
              type: 'paragraph',
              text: 'A homography is a projective transformation that relates two views of the same planar surface. It is represented in homogeneous coordinates by the equation:'
            },
            {
              type: 'math',
              text: '\\( \\begin{bmatrix} a & b & c \\\\ d & e & f \\\\ g & h & 1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} w x\' \\\\ w y\' \\\\ w \\end{bmatrix} \\)'
            },
            {
              type: 'paragraph',
              text: 'Here, w is the scaling factor. To eliminate w, we can rewrite the equation as:'
            },
            {
              type: 'math',
              text: '\\( \\begin{aligned} ax + by + c &= (gx + hy + 1)x\' \\\\ dx + ey + f &= (gx + hy + 1)y\' \\end{aligned} \\)'
            },
            {
              type: 'paragraph',
              text: 'We can further simplify them to the following system:'
            },
            {
              type: 'math',
              text: '\\( \\begin{aligned} ax + by + c - gxx\' - hyx\' &= x\' \\\\ dx + ey + f - gxy\' - hyy\' &= y\' \\end{aligned} \\)'
            },
            {
              type: 'math',
              text: '\\( \\begin{bmatrix} x & y & 1 & 0 & 0 & 0 & -xx\' & -yx\' \\\\ 0 & 0 & 0 & x & y & 1 & -xy\' & -yy\' \\end{bmatrix} \\begin{bmatrix} a \\\\ b \\\\ c \\\\ d \\\\ e \\\\ f \\\\ g \\\\ h \\end{bmatrix} = \\begin{bmatrix} x\' \\\\ y\' \\end{bmatrix} \\)'
            },
            {
              type: 'paragraph',
              text: 'Each correspondence between points in two images provides two such equations. By stacking multiple correspondences horizontally, we create an overdetermined system, which we solve for H using a least squares estimate.'
            },
          ]
        },
        {
          id: 'image-rect',
          title: 'Image Rectification',
          content: [
            {
              type: 'paragraph',
              text: 'An application of homography is image rectification, where an object viewed at an angle can be adjusted to appear front-facing. In the following examples, the corners of the paintings are selected as keypoints, with the corresponding destination keypoints forming either a square or a 3:2 rectangle, depending on the true dimensions of the paintings. After computing the homography matrix (H), we first determine the bounding box of the warped image by applying the transformation to the four corners of the image. Next, we perform inverse warping to map the image onto the destination surface. For each point in the destination image, we calculate its corresponding point (preimage) in the source image using the inverse of H. If the preimage coordinates are not integers, we use bilinear interpolation, estimating the pixel value by interpolating between the four nearest neighboring pixels in the source image. The calculated value is then assigned to the corresponding pixel in the destination image.'
            },
            {
              type: 'image-grid',
              columns: 4,
              images: [
                { title: 'Painting 1', imageUrl: `${process.env.PUBLIC_URL}/images/painting1.jpg` },
                { title: 'Painting 1 rectified', imageUrl: `${process.env.PUBLIC_URL}/images/p1r.jpg` },
                { title: 'Painting 2', imageUrl: `${process.env.PUBLIC_URL}/images/painting2.jpg` },
                { title: 'Painting 2 rectified', imageUrl: `${process.env.PUBLIC_URL}/images/p2r.jpg` },
              ]
            },
          ]
        },
        {
          id: 'image-mosaic',
          title: 'Image Mosaic',
          content: [
            {
              type: 'list',
              items: [
                {
                  text: 'Identify keypoints and compute homography:',
                  sublist: [
                    'Identify corresponding keypoints between pairs of overlapping images. This is done manually.',
                    'Compute the homography (least squares) between each pair of images.'
                  ]
                },
                {
                  text: 'Choose a composition surface:',
                  sublist: [
                    'If stitching three images, choose the middle image as the planar composition surface.',
                    'If stitching two images, either image can be used as the composition surface.',
                    'In general, choose the most central image as the planar composition surface. Since matrix multiplication is associative, any order of chaining the Homographies together will give the same results. '
                  ]
                },
                {
                  text: 'Warp images toward the composition surface:',
                  sublist: [
                    'Perform inverse warping to align the images to the composition surface.',
                    'Add padding around areas where an image does not fully cover the composition surface.'
                  ]
                },
                {
                  text: 'Blend the images together using a two-band Laplacian:',
                  sublist: [
                    'For the low-frequency band, blend the images using a convex combination of the pixel values, with blending coefficients based on their relative distance transform.',
                    {
                      type: 'math',
                      text: '\\( p_{blend} = (1 - t) p_1 + t p_2 \\quad \\text{where} \\quad t = \\frac{d_1}{d_1 + d_2} \\)'
                    },
                    'For the high-frequency band, choose the pixel with the higher distance transform between the overlapping images.',
                    'Low-frequency components are blended smoothly because they represent gradual changes and should transition seamlessly between images. High-frequency components represent sharp details and should remain distinct, so the pixel with the higher distance transform is chosen to retain clarity.'
                  ]
                },
              ]
            },
            {
              type: 'paragraph',
              text: 'In the following process, we stitch three images: house1, house2, and house3. House2 is selected as the composition plane. First, we warp and blend house1 with house2. Afterward, the same procedure is applied to house3, warping and blending it with the intermediate combined result of house1 and house2 to create the final image.'
            },
            {
              type: 'image-grid',
              columns: 3,
              images: [
                { title: 'House 1', imageUrl: `${process.env.PUBLIC_URL}/images/1737_1.jpg` },
                { title: 'House 2 ', imageUrl: `${process.env.PUBLIC_URL}/images/1737_2.jpg` },
                { title: 'House 3', imageUrl: `${process.env.PUBLIC_URL}/images/1737_3.jpg` },
              ]
            },
            {
              type: 'image-grid',
              columns: 5,
              images: [
                { title: 'House 1 warped', imageUrl: `${process.env.PUBLIC_URL}/images/warped_image_17371_1.jpg` },
                { title: 'House 2 padded ', imageUrl: `${process.env.PUBLIC_URL}/images/padded_image_17371_2.jpg` },
                { title: 'House 1 distance transform', imageUrl: `${process.env.PUBLIC_URL}/images/17371d.jpg`},
                { title: 'House 2 distance transform', imageUrl: `${process.env.PUBLIC_URL}/images/17372d.jpg` },
                { title: 'Intermediate', imageUrl: `${process.env.PUBLIC_URL}/images/1737_1_2.jpg` },
              ]
            },
            {
              type: 'image-grid',
              columns: 3,
              images: [
                { title: 'House 3 warped', imageUrl: `${process.env.PUBLIC_URL}/images/im_17371_3_warped.jpg` },
                { title: 'Intermediate padded ', imageUrl: `${process.env.PUBLIC_URL}/images/im_17371_1_2_padded.jpg` },
                { title: 'Final Image', imageUrl: `${process.env.PUBLIC_URL}/images/1737_final.jpg` },
              ]
            },
            {
              type: 'paragraph',
              text: 'Here are more examples:'
            },
            {
              type: 'image-grid',
              columns: 3,
              images: [
                { title: 'VLSB1', imageUrl: `${process.env.PUBLIC_URL}/images/vlsb1.jpg` },
                { title: 'VLSB2', imageUrl: `${process.env.PUBLIC_URL}/images/vlsb2.jpg` },
                { title: 'Final Image', imageUrl: `${process.env.PUBLIC_URL}/images/vlsb12.jpg` },
              ]
            },
            {
              type: 'image-grid',
              columns: 3,
              images: [
                { title: 'tree1', imageUrl: `${process.env.PUBLIC_URL}/images/tree1.jpg` },
                { title: 'tree2', imageUrl: `${process.env.PUBLIC_URL}/images/tree2.jpg` },
                { title: 'Final Image', imageUrl: `${process.env.PUBLIC_URL}/images/tree12.jpg` },
              ]
            },
          ]
        },
      ]
    },
    {
      id: 'automatic-feature-matchin',
      title: 'Automatic Feature Matching',
      sections: [
        {
          id: 'feature-detector',
          title: 'Feature Detector',
          content: [
            {
              type: 'paragraph',
              text: 'We first note that corners make good features. A corner is a point in an image which produces strong change in intensity when shifted in any direction.'
            },
            {
              type: 'paragraph',
              text: 'We use the Harris Detector to find the corners of an image. The Harris matrix at position (x,y) is the smoothed outer product of the gradients:'
            },
            {
              type: 'math',
              text: '\\( \\mathbf{H}(x, y) = \\sum_{(i, j) \\in W} \\nabla I(i, j) \\nabla I(i, j)^T \\cdot g_{\\sigma_i}(i, j) \\)'
            },
            {
              type: 'paragraph',
              text: 'To interpret the Harris matrix, we start with computing the change in appearance of a window W for a shift (u,v):'
            },
            {
              type: 'math',
              text: `
                \\(
                \\begin{aligned}
                E(u, v) &= \\sum_{(x, y) \\in W} \\left[ I(x + u, y + v) - I(x, y) \\right]^2 \\\\
                &\\approx \\sum_{(x, y) \\in W} \\left[ I(x, y) + \\nabla I(x, y)^T \\begin{bmatrix} u \\\\ v \\end{bmatrix} - I(x, y) \\right]^2 \\\\
                &= \\sum_{(x, y) \\in W} \\left( \\nabla I(x, y)^T \\begin{bmatrix} u \\\\ v \\end{bmatrix} \\right)^2 \\\\
                &= \\sum_{(x, y) \\in W} \\begin{bmatrix} u & v \\end{bmatrix}  \\nabla I(x, y) \\nabla I(x, y)^T  \\begin{bmatrix} u \\\\ v \\end{bmatrix}
                \\end{aligned}
                \\)
              `
            },
            {
              type: 'paragraph',
              text: 'We can analyze the level sets of this term, which form an ellipse. By diagonalizing the Harris matrix, we can compute the semi-major and semi-minor axes of the ellipse.'
            },
            {
              type: 'math',
              text: `
                \\(
                \\begin{aligned}
                x^T \\mathbf{H} x = 1 \\\\
                x^T V \\Lambda V^T x = 1 \\\\
                a = \\sqrt{\\frac{1}{\\lambda_{\\min}}}, \\quad b = \\sqrt{\\frac{1}{\\lambda_{\\max}}}
                \\end{aligned}
                \\)
              `
            },
            {
              type: 'image-grid',
              columns: 1,
              images: [
                { title: 'Level sets', imageUrl: `${process.env.PUBLIC_URL}/images/ellipse.png` },
              ]
            },
            {
              type: 'paragraph',
              text: 'For large change in all directions, we would want both eigenvalues to be large. One such way to do this is to compute the following ratio:',
            },
            {
              type: 'math',
              text: `
                \\(
                \\begin{aligned}
                R &= \\frac{\\lambda_1 \\lambda_2}{\\lambda_1 + \\lambda_2} \\\\
                  &= \\frac{\\det(\\mathbf{H})}{\\operatorname{tr}(\\mathbf{H})}
                \\end{aligned}
                \\)
              `
            },
            {
              type: 'paragraph',
              text: 'In addition to requiring R to be above a certain threshold, we also add a requirement for R of a point to be a maxima over a small local neighbourhood. Here are some results:',
            },
            {
              type: 'image-grid',
              columns: 4,
              images: [
                { title: 'House 1', imageUrl: `${process.env.PUBLIC_URL}/images/1737_1.jpg` },
                { title: 'House 1 (Harris corners) ', imageUrl: `${process.env.PUBLIC_URL}/images/1737_1_corners.jpg` },
                { title: 'House 2', imageUrl: `${process.env.PUBLIC_URL}/images/1737_2.jpg` },
                { title: 'House 2 (Harris corners) ', imageUrl: `${process.env.PUBLIC_URL}/images/1737_2_corners.jpg` },              ]
            },
            {
              type: 'paragraph',
              text: 'Next, we perform adaptive non-maximum suppression.  The goal of this is to retain only the interest points with the highest R while ensuring that they are spread out (for better alignment). This is first done by computing the suppression radius of every point and keeping the top 500 points with the largest suppression radius. The suppression radius is calculated by:'
            },
            {
              type: 'math',
              text: '\\( r_i = \\min_j \\| \\mathbf{x}_i - \\mathbf{x}_j \\|_2, \\; \\text{s.t.} \\; R(\\mathbf{x}_i) < c_{\\text{robust}} R(\\mathbf{x}_j), \\; \\mathbf{x}_j \\in \\mathcal{I} \\)'
            },
            {
              type: 'paragraph',
              text: 'To improve the efficiency of suppression radius calculation, each point is compared only to its nearest neighbors (using a kdtree) in decreasing order of intensity and stops once a neighbor with a higher response value is found. The top 500 points with the largest suppression radii from each image are selected as follows:'
            },
            {
              type: 'image-grid',
              columns: 2,
              images: [
                { title: 'House 1 Suppressed Points ', imageUrl: `${process.env.PUBLIC_URL}/images/1737_1_corners_anms.jpg` },              
                { title: 'House 2 Suppressed Points ', imageUrl: `${process.env.PUBLIC_URL}/images/1737_2_corners_anms.jpg` },              
              ]
            }
          ]
        },
        
        {
          id: 'feature-descriptor',
          title: 'Feature Descriptor',
          content: [
            {
              type: 'paragraph',
              text: 'For each of the 500 selected interest points, we compute a mini-MOPS (Multi-Scale Oriented Patches) descriptor. For this part of the project, the descriptor is only single-scale and not oriented. This involves extracting a 40x40 pixel patch centered around each interest point, then resizing it to an 8x8 patch using anti-aliasing (Gaussian blur). Finally, we normalize the resulting 8x8 patch to make the descriptor invariant to illumination differences.'
            },
            {
              type: 'image-grid',
              columns: 1,
              images: [
                { title: 'Example descriptors', imageUrl: `${process.env.PUBLIC_URL}/images/mops.jpg` },              
              ]
            }
          ]
        },
        {
          id: 'feature-matching',
          title: 'Feature Matching',
          content: [
            {
              type: 'paragraph',
              text: 'At this stage, we have a set of feature points and their descriptors. To identify corresponding points between two images, we compute the L2 distance between each descriptor in one image and its first and second nearest neighbors (1NN and 2NN) in the other image. We accept a match if the ratio of the distance to the 1NN and the 2NN is below a specified threshold, following Lowe\'s trick. This ensures that the closest neighbor is significantly closer than the second-closest, indicating a likely correct match. Additionally, we enforce bidirectional matching, meaning the corresponding keypoints in both images must be mutually nearest neighbors. For this example, only 170 out of the 500 keypoints are retained:'
            },
            {
              type: 'image-grid',
              columns: 1,
              images: [
                { title: 'Matched Keypoints ', imageUrl: `${process.env.PUBLIC_URL}/images/mutual_matches_joined12.jpg` },              
              ]
            }
          ]
        },
        {
          id: 'ransac',
          title: 'Computing Homography (RANSAC)',
          content: [
            {
              type: 'paragraph',
              text: 'We perform Random Sample Consensus to further filter out the good from the bad matches.'
            },
            {
              type: 'list',
              items: [
                'Select 4 feature points at random (sampled without replacement).',
                'Compute the homography H from these 4 points. With exactly 4 points, each providing 2 equations, we can solve for H exactly rather than using a least-squares estimate.',
                'Using this H, transform all feature points in image 1 and identify inliers where the L2 distance between the transformed point and the corresponding keypoint in image 2 is less than 1 pixel.',
                'Repeat steps 1 to 3 for 10,000 iterations, keeping track of the largest set of inliers found.',
                'After the RANSAC loop terminates, compute the least-squares estimate for H using all inliers to obtain the final transformation matrix.'
              ]
            },
            {
              type: 'image-grid',
              columns: 1,
              images: [
                { title: 'Inliers, after RANSAC', imageUrl: `${process.env.PUBLIC_URL}/images/ransac_12.jpg` },              
              ]
            }
          ]
        },
        {
          id: 'mosaic-results',
          title: 'Results',
          content: [
            {
              type: 'paragraph',
              text: 'After computing H, we perform the same steps 2-4 from the Image Mosaic section. Here are some results:'
            },
            {
              type: 'image-grid',
              columns: 2,
              images: [
                { title: 'House (manual)', imageUrl: `${process.env.PUBLIC_URL}/images/1737_final.jpg` },              
                { title: 'House (automatic)', imageUrl: `${process.env.PUBLIC_URL}/images/1737_final_auto.jpg` },
                { title: 'VLSB (manual)', imageUrl: `${process.env.PUBLIC_URL}/images/vlsb12.jpg` },              
                { title: 'VLSB (automatic)', imageUrl: `${process.env.PUBLIC_URL}/images/vlsb_1_2_auto.jpg` },
                { title: 'Tree (manual)', imageUrl: `${process.env.PUBLIC_URL}/images/tree12.jpg` },              
                { title: 'Tree (automatic)', imageUrl: `${process.env.PUBLIC_URL}/images/tree_1_2_auto.jpg` },              
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'adding-invariance',
      title: 'Scale and Rotation Invariance',
      sections: [
        {
          id: 'scale-invariance',
          title: 'Scale Invariance',
          content: [
            {
              type: 'paragraph',
              text: 'To enable detection of Harris corners in different scales, we form a Gaussian Pyramid with subsampling rate 2 and perform the Harris corner detection across all these different layers. The MOPS descriptor formed for each feature point is formed from a 40x40 patch from the layer where the corner is taken from. To resize this 40x40 patch to 8x8, we can just use higher levels of the Gaussian Pyramid rather than having to do this resizing again.',
            },
          ]
        },
        
        {
          id: 'rotation-invariance',
          title: 'Rotation Invariance',
          content: [
            {
              type: 'paragraph',
              text: '2 matching corners may be rotated relative to one another. In the initial implementation, we computed the mini-MOPS detector without accounting for the orientation of the corner, which may result in missing out potential good matches or worse - wrongfully classifying bad matches as good. To fix this, when detecting the Harris Corners, we compute the orientation of the interest points. This is done by first smoothing the layer where the corner is taken from and then computing the orientation vector v.',
            },
            {
              type: 'math',
              text: `\\[
                \\mathbf{u}_l(x, y) = \\nabla_{\\sigma_o} I_l(x, y)
              \\]`
            },
            {
              type: 'math',
              text: `\\[
                \\begin{aligned}
                  \\text{Let} \\; \\mathbf{v} &= \\frac{\\mathbf{u}_{l}}{\\| \\mathbf{u}_{l} \\|}, \\\\
                  \\text{where} \\; \\mathbf{v} &= \\begin{bmatrix} \\cos \\theta \\\\ \\sin \\theta \\end{bmatrix}.
                \\end{aligned}
              \\]`
            },
            {
              type: 'paragraph',
              text: 'When computing the MOPS descriptor, we first rotate the 40x40 window around the feature point based on its orientation vector before resizing it into 8x8 and normalizing. This way, all corners will be aligned to the same orientation, making the feature detection rotationally invariant.',
            },
          ]
        },
        {
          id: 'results-with-invariance',
          title: 'Results',
          content: [
            {
              type: 'paragraph',
              text: 'The scale and rotational invariance improves the robustness of the matching, giving better alignment and stitching.',
            },
            {
              type: 'image-grid',
              columns: 1,
              images: [
                { title: 'MOPS descriptors', imageUrl: `${process.env.PUBLIC_URL}/images/mops2.jpg` },              
              ]
            },
            {
              type: 'paragraph',
              text: 'From the examples below, we can see that the addition of scale and rotational invariance greatly improves the alignment and stitching.',
            },
            {
              type: 'image-grid',
              columns: 2,
              images: [
                { title: 'No scale and rotational invariance', imageUrl: `${process.env.PUBLIC_URL}/images/vlsb_1_2_auto.jpg` },              
                { title: 'With scale and rotational invariance', imageUrl: `${process.env.PUBLIC_URL}/images/vlsb12_auto_mops.jpg` },              
              ]
            }
          ]
        },
      ]
    },
    {
      id: 'homography-cylindrical',
      title: 'Homography onto Cylindrical Surface and Panorama',
      sections: [
        {
          id: 'cylindrical-projection',
          title: 'Cylindrical Projection',
          content: [
            {
              type: 'paragraph',
              text: 'Cylindrical projection helps to map an image from its flat, rectilinear form onto a cylindrical surface. This transformation is particularly useful for minimizing distortions when creating panoramas, as it maintains vertical lines and ensures smoother transitions between stitched images. To achieve this, we begin by calculating the angular and vertical coordinates of each pixel relative to the image center, based on the camera’s focal length f.'
            },
            {
              type: 'math',
              text: '\\( \\theta = f \\cdot \\arctan\\left( \\frac{x}{f} \\right), \\quad h = f \\cdot \\frac{y}{\\sqrt{x^2 + f^2}} \\)'
            },
            {
              type: 'paragraph',
              text: 'In this equation, theta represents the angular offset of the pixel along the horizontal axis, while h represents the vertical offset on the cylindrical surface. The resulting coordinates (theta, h) describe the position of each pixel after the cylindrical transformation.'
            },
            {
              type: 'paragraph',
              text: 'To reproject these cylindrical coordinates back to the original image space, we use an inverse warp, which takes the projected coordinates (theta, h) and maps them back to the rectilinear pixel locations. The formulas for this inverse transformation are given by:'
            },
            {
              type: 'math',
              text: '\\( \\hat{x} = \\sin\\left( \\frac{\\theta}{f} \\right), \\quad \\hat{y} = \\frac{h}{f}, \\quad \\hat{z} = \\cos\\left( \\frac{\\theta}{f} \\right) \\)'
            },
            {
              type: 'paragraph',
              text: 'Here is an example of a reprojected image:'
            },
            {
              type: 'image-grid',
              columns: 1,
              images: [
                { title: 'Reprojected', imageUrl: `${process.env.PUBLIC_URL}/images/im1c.jpg` },
              ]
            },  
          ]
        },
        
        {
          id: 'panorama',
          title: 'Panorama',
          content: [
            {
              type: 'paragraph',
              text: 'We first try and determine the focal length. The focal length f in pixel units is calculated based on the iPhone 13 Pro Max’s physical focal length of 5.7 mm and a sensor width of 7.01 mm. The original image resolution is 4032 pixels wide, while the resized image is 560 pixels wide, giving a scaling factor of approximately 0.139.'
            },
            {
              type: 'math',
              text: '\\( f = \\frac{\\text{\\text{focal length in mm}}}{\\text{sensor width in mm}} \\times \\text{image width in pixels} \\)'
            },
            {
              type: 'paragraph',
              text: 'Using this formula, the focal length for the original image is about 3276 pixels. After applying the scaling factor, the adjusted focal length for the resized image is approximately 455 pixels.'
            },
            {
              type: 'paragraph',
              text: 'After finding f, we first project each image into cylindrical coordinates and then reproject it back to rectilinear coordinates. Once reprojected, we identify keypoints on the transformed images. After this, we perform the same transformation computations, including warping and blending, as done previously. However, in this case, we allow only for translation, since rotation in the original cylindrical space corresponds to translation in the reprojected images.'
            },
            {
              type: 'paragraph',
              text: 'Using the same two-band blending technique as before did not produce satisfactory results, as noticeable seams appeared where the images overlapped. To address this issue, I applied global exposure compensation by adjusting the brightness and contrast across the entire image set to ensure consistency between them before blending. Additionally, I experimented with gradient-domain blending, which smooths the transition between overlapping areas by minimizing the gradient differences between images.'
            },
            {
              type: 'paragraph',
              text: 'Of these three methods, the second yielded the best results, but they were still not ideal. One key reason for this is that the cylindrical projection model assumes pure rotational alignment, but since I captured these images handheld without a tripod, there were shifts in the center of projection, introducing alignment errors. Also, the focal length is just an estimate and may be wrong.'
            },
            {
              type: 'image-grid',
              columns: 1,
              images: [
                { title: '2-band', imageUrl: `${process.env.PUBLIC_URL}/images/panorama.jpg` },
              ]
            },
            {
              type: 'image-grid',
              columns: 1,
              images: [
                { title: '2-band with exposure correction', imageUrl: `${process.env.PUBLIC_URL}/images/panorama_exposure_adjusted.jpg` },
              ]
            },
            {
              type: 'image-grid',
              columns: 1,
              images: [
                { title: 'Gradient domain', imageUrl: `${process.env.PUBLIC_URL}/images/panorama_poisson.jpg` },
              ]
            },
          ]
        },
      ]
    },
    {
      id: 'reflection',
      title: 'Reflection',
      sections: [
        {
          id: 'lowes-trick',
          title: 'Lowe\'s Trick',
          content: [
            {
              type: 'paragraph',
              text: 'I find Lowe\'s trick particularly interesting because it\'s a simple yet highly effective approach that doesn\'t rely on complex optimization but rather a clever, intuitive decision rule. It shows how simplicity prevails.'
            },
          ]
        }
      ]
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-300">
      <Navbar parentSections={parentSections} />
      <div className="flex-1 px-4 sm:px-2 lg:px-8 py-8 md:ml-64 w-full">
        <h1 className="text-3xl sm:text-2xl lg:text-4xl font-bold text-center mb-12 text-white">Image Stitching</h1>

        {parentSections.map((parent) => (
          <ParentSection
            key={parent.id}
            id={parent.id}
            title={parent.title}
            sections={parent.sections}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
