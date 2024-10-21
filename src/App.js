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
          title: 'Feature Detection and Matching',
          content: [
            {
              type: 'paragraph',
              text: 'For now, feature detection and matching is done manually. Corresponding keypoints between pairs of images are identified.'
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
                    'Identify corresponding keypoints between pairs of overlapping images.',
                    'Compute the homography between each pair of images.'
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
    }
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
